import logging
import boto3

from tickets.internal.aws.sqs import SqsEvent, SqsRecord
from tickets.internal.domain import Order, QRCode, TicketMailer, TicketManager, Webhooks

from tickets.internal.config import mandatory_env


class Handler:
    def __init__(self, ticket_manager: TicketManager):
        self._ticket_manager = ticket_manager

    @staticmethod
    def make_from_env():
        logging.basicConfig()
        logging.getLogger().setLevel(logging.INFO)

        return Handler(
            ticket_manager=TicketManager(
                qr_code=QRCode(),
                ticket_mailer=TicketMailer(
                    api_key=mandatory_env("MAILER_SEND_API_KEY"),
                ),
                s3=boto3.client("s3"),
                bucket_name=mandatory_env("TICKETS_BUCKET_NAME"),
                webhooks=Webhooks(
                    url=mandatory_env("WEBHOOKS_URL"),
                    secret=mandatory_env("WEBHOOKS_SECRET")
                )
            )
        )

    def handle(self, event, _context):
        logging.info("event: %s" % event)

        sqs_event = SqsEvent.parse(event)
        self.handle_events(sqs_event.records)

        logging.info("Events handled successfully")

    def handle_events(self, events: list[SqsRecord]):
        for event in events:
            order = Order.from_json_string(event.body)
            self.handle_order(order)

    def handle_order(self, order: Order):
        ticket_infos = []

        for ticket in order.tickets:
            # Generate PDF
            pdf_ticket = self._ticket_manager.generate_ticket(
                event_details=order.event_details,
                ticket=ticket
            )

            # Upload PDF to S3
            ticket_url = self._ticket_manager.upload_pdf_to_s3(
                event_id=order.event_details.id,
                ticket_id=ticket.ticket_id,
                pdf=pdf_ticket
            )

            ticket_infos.append((ticket_url, ticket))

        # Send email with link to PDF
        self._ticket_manager.send_tickets(
            customer_details=order.customer_details,
            event_details=order.event_details,
            ticket_info=ticket_infos
        )

        # Call Webhooks to complete the order
        self._ticket_manager.update_ticket_statuses(ticket_infos)