import logging

from invoices.internal.domain import InvoiceRequest, InvoiceManager, Webhooks
from invoices.internal.aws.sqs import SqsEvent, SqsRecord

from invoices.internal.config import mandatory_env


class Handler:
    def __init__(self, invoice_manager: InvoiceManager, webhooks: Webhooks):
        self._invoice_manager = invoice_manager
        self._webhooks = webhooks

    @staticmethod
    def make_from_env():
        logging.basicConfig()
        logging.getLogger().setLevel(logging.INFO)

        return Handler(
            invoice_manager=InvoiceManager(
                invoice_agent_key=mandatory_env("INVOICE_AGENT_KEY")
            ),
            webhooks=Webhooks(
                secret=mandatory_env("WEBHOOKS_SECRET")
            )
        )

    def handle(self, event, _context):
        logging.info("event: %s" % event)

        sqs_event = SqsEvent.parse(event)
        self.handle_events(sqs_event.records)

        logging.info("Events handled successfully")

    def handle_events(self, events: list[SqsRecord]):
        for event in events:
            invoice_request = InvoiceRequest.from_json_string(event.body)
            self.handle_invoice_request(invoice_request)

    def handle_invoice_request(self, invoice_request: InvoiceRequest):
        logging.info(f"Handling invoice request for invoice {invoice_request.id}")

        try:
            invoice = self._invoice_manager.build_invoice(invoice_request)
            self._invoice_manager.send_invoice(invoice_request.id, invoice)
        except Exception as e:
            logging.error(f"Failed to handle invoice request for invoice {invoice_request.id}")
            logging.error(e)
            raise e
