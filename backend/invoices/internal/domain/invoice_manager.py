import logging
from io import BytesIO

import requests

from .invoice import Invoice, Settings, Header, Seller, Buyer, Items, Item, InvoiceResponse
from .invoice_request import InvoiceRequest


class InvoiceManager:
    def __init__(self, invoice_agent_key: str):
        self._invoice_agent_key = invoice_agent_key
        self._url = "https://www.szamlazz.hu/szamla/"

    def build_invoice(self, invoice_request: InvoiceRequest) -> Invoice:
        logging.info("Building invoice")

        invoice = Invoice(
            settings=Settings(
                invoice_agent_key=self._invoice_agent_key,
                e_invoice=True,
                invoice_download=False,
                response_version=2
            ),
            header=Header(
                issue_date=invoice_request.invoice_date,
                fulfillment_date=invoice_request.invoice_date,
                payment_deadline_date=invoice_request.invoice_date,
                payment_method="Bankkártya",
                currency="HUF",
                invoice_language="hu",
                order_number=invoice_request.order_id,
                advance_invoice=False,
                final_invoice=False,
                corrective_invoice=False,
                proforma_invoice_request=False,
                invoice_prefix=invoice_request.invoice_prefix,
            ),
            seller=Seller(
                bank=invoice_request.seller.bank,
                account_number=invoice_request.seller.account_number
            ),
            buyer=Buyer(
                name=invoice_request.billing_details.name,
                postal_code=invoice_request.billing_details.zip,
                city=invoice_request.billing_details.city,
                address=invoice_request.billing_details.address,
                email=invoice_request.billing_details.email,
                send_email=True,
                tax_number=invoice_request.billing_details.tax_number
            ),
            items=Items(items=self._build_invoice_items(invoice_request))
        )

        return invoice

    def send_invoice(self, id: str, invoice: Invoice) -> str:
        logging.info(f"Sending invoice {id}")

        invoice_payload = invoice.to_xml(
            encoding='Unicode',
            method='xml',
        )

        # Convert XML string content to a file-like object
        file = BytesIO(invoice_payload.encode('utf-8'))

        # Define the multipart/form-data payload
        files = {
            'action-xmlagentxmlfile': ('agent.xml', file, 'application/xml'),
        }

        # Send the POST request
        response = requests.post(self._url, files=files)

        if response.status_code != 200:
            raise Exception(f"Failed to send invoice: {response.content}")

        invoice_response = InvoiceResponse.from_xml(response.content)

        if not invoice_response.success:
            raise Exception(f"Failed to send invoice: {response.text}")

        logging.info(f"Invoice {invoice_response.invoice_number} Sent Successfully")

        return invoice_response.invoice_number

    @staticmethod
    def _build_invoice_items(invoice_request: InvoiceRequest) -> list[Item]:
        items = []

        for item in invoice_request.items:
            vat = 27
            gross_unit_price = item.unit_price
            net_unit_price = gross_unit_price / (1 + vat / 100)
            tax = (gross_unit_price - net_unit_price)

            items.append(Item(
                description=item.item_type,
                quantity=item.quantity,
                unit="db",
                net_unit_price=net_unit_price,
                tax_rate=vat,
                net_value=net_unit_price * item.quantity,
                tax_value=tax * item.quantity,
                gross_value=gross_unit_price * item.quantity
            ))

        return items


