import io
import logging
import asyncio

import botocore
from botocore.client import BaseClient

from .webhooks import Webhooks
from .mailer import TicketMailer
from .order import Ticket, EventDetails, Order
from .qr_code import QRCode
from .pdf_creator import PDFCreator


class TicketManager:
    def __init__(self,
                 qr_code: QRCode,
                 ticket_mailer: TicketMailer,
                 s3: BaseClient,
                 bucket_name: str,
                 webhooks: Webhooks,
                 pdf_creator: PDFCreator,
                 ):
        self._qr_code = qr_code
        self._ticket_mailer = ticket_mailer
        self._s3 = s3
        self._bucket_name = bucket_name
        self._webhooks = webhooks
        self._pdf_creator = pdf_creator

    def generate_ticket(self, event_details: EventDetails, ticket: Ticket) -> io.BytesIO:
        # Generate QR Code
        qr_code_image = self._qr_code.generate(ticket.ticket_id)

        logging.info("QR Code Ready")

        # Generate PDF
        pdf = self._pdf_creator.create_pdf(
            event_name=event_details.name,
            start_date=event_details.start_date.strftime('%Y.%m.%d. %H:%M'),
            location=event_details.address.to_location(),
            qr_image=qr_code_image,
            ticket=ticket,
        )

        logging.info("PDF Generated")

        return pdf

    def upload_pdf_to_s3(self, event_id: str, ticket_id: str, pdf: io.BytesIO) -> str:
        key_name = f"event_{event_id}/{ticket_id}.pdf"

        # Ensure the file pointer is at the beginning
        pdf.seek(0)

        # Construct the URL of the uploaded file
        url = f"https://{self._bucket_name}.s3.amazonaws.com/{key_name}"

        # Check if file already exists
        try:
            self._s3.head_object(Bucket=self._bucket_name, Key=key_name)
            logging.warning(f"File already exists in S3 ({url})")
            return url
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] != "404":
                raise e

        # Upload the file
        self._s3.upload_fileobj(
            Fileobj=pdf,
            Bucket=self._bucket_name,
            Key=key_name
        )

        logging.info(f"PDF Uploaded to S3 ({url})")

        return url

    def send_tickets(self, order: Order):
        self._ticket_mailer.send_tickets(
            order=order
        )

        logging.info(f"Tickets sent to {order.customer_details.name} <{order.customer_details.email}>")

    def update_order_and_tickets(self, order: Order, ticket_info: list[tuple[str, Ticket]]):
        async def update_all():
            tasks = [
                self._webhooks.update_ticket(
                    ticket_id=ticket.ticket_id,
                    ticket_callback_url=ticket.ticket_callback_url,
                    status="printed",
                    payload={"ticketUrl": ticket_url}
                )
                for ticket_url, ticket in ticket_info
            ]

            await asyncio.gather(*tasks)
            logging.info("Ticket statuses updated")

            await self._webhooks.update_order(
                    order_id=order.order_id,
                    order_callback_url=order.order_callback_url,
                    status="delivered"
                )
            logging.info("Order statuses updated")

        # Run the asynchronous tasks from a synchronous context
        asyncio.run(update_all())
