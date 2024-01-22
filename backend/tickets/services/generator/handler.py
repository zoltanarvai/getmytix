import logging

from tickets.internal.aws.sqs import SqsEvent, SqsRecord
from tickets.internal.domain import Order


class Handler:
    @staticmethod
    def make_from_env():
        logging.basicConfig()
        logging.getLogger().setLevel(logging.INFO)

        return Handler()

    def handle(self, event, _context):
        logging.info("event: %s" % event)

        sqs_event = SqsEvent.parse(event)
        self.handle_events(sqs_event.records)

    def handle_events(self, events: list[SqsRecord]):
        for event in events:
            order = Order.from_json_string(event.body)
            self.handle_order(order)

    def handle_order(self, order: Order):
        # Generate QR Code
        # Generate PDF
        # Upload PDF to S3

        # Send email with link to PDF
        # Fire of event to Invoicing SQS queue
        pass
