import io
import logging
import asyncio

import botocore
from botocore.client import BaseClient

from .webhooks import Webhooks
from .mailer import TicketMailer
from .order import Ticket, EventDetails, CustomerDetails, Order
from .qr_code import QRCode
from .pdf_creator import PDFCreator


class TicketManager:
    def __init__(self,
                 qr_code: QRCode,
                 ticket_mailer: TicketMailer,
                 s3: BaseClient,
                 bucket_name: str,
                 webhooks: Webhooks
                 ):
        self._qr_code = qr_code
        self._ticket_mailer = ticket_mailer
        self._s3 = s3
        self._bucket_name = bucket_name
        self._webhooks = webhooks

    def generate_ticket(self, event_details: EventDetails, ticket: Ticket) -> io.BytesIO:
        # Generate QR Code
        qr_code_image = self._qr_code.generate(ticket.ticket_id)

        logging.info("QR Code Ready")

        # Generate PDF
        pdf = PDFCreator.create_pdf(
            event_name=event_details.name,
            start_date=event_details.start_date.isoformat(),
            location=event_details.address.to_location(),
            ticket_type=ticket.ticket_type,
            qr_image=qr_code_image
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

    def send_tickets(self, customer_details: CustomerDetails, event_details: EventDetails, ticket_info: list[tuple[str, Ticket]]):
        self._ticket_mailer.send_ticket(
            recipient_name=customer_details.name,
            recipient_email=customer_details.email,
            event_name=event_details.name,
            ticket_infos=ticket_info
        )

        logging.info(f"Tickets sent to {customer_details.name} <{customer_details.email}>")

    def update_ticket_statuses(self, ticket_info: list[tuple[str, Ticket]]):
        async def update_all_tickets():
            tasks = [
                self._webhooks.update_ticket(
                    ticket_id=ticket.ticket_id,
                    ticket_callback_url=ticket.ticket_callback_url,
                    status="printed",
                    payload={"ticket_url": ticket_url}
                )
                for ticket_url, ticket in ticket_info
            ]
            await asyncio.gather(*tasks)

        # Run the asynchronous tasks from a synchronous context
        asyncio.run(update_all_tickets())

        logging.info("Ticket statuses updated")

    def update_order_delivered(self, order: Order):
        async def update_order():
            tasks = [
                self._webhooks.update_order(
                    order_id=order.order_id,
                    order_callback_url=order.order_callback_url,
                    status="delivered"
                )
            ]
            await asyncio.gather(*tasks)

        # Run the asynchronous tasks from a synchronous context
        asyncio.run(update_order())

        logging.info("Order statuses updated")
