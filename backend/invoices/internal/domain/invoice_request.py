import json
from pydantic import BaseModel, Field


class Seller(BaseModel):
    bank: str = Field(alias="bank")
    account_number: str = Field(alias="accountNumber")


class BillingDetails(BaseModel):
    name: str = Field(alias="name")
    tax_number: str | None = Field(None, alias="taxNumber")
    address: str = Field(alias="address")
    email: str = Field(alias="email")
    city: str = Field(alias="city")
    zip: str = Field(alias="zip")


class Item(BaseModel):
    item_id: str = Field(alias="itemId")
    item_type: str = Field(alias="itemType")
    item_title: str = Field(alias="itemTitle")
    quantity: int = Field(alias="quantity")
    unit_price: float = Field(alias="unitPrice")
    comment: str | None = Field(alias="comment", default=None)


class InvoiceRequest(BaseModel):
    id: str = Field(alias="id")
    order_id: str = Field(alias="orderId")
    invoice_date: str = Field(alias="invoiceDate")
    invoice_prefix: str = Field(alias="invoicePrefix")
    seller: Seller = Field(alias="seller")
    billing_details: BillingDetails = Field(alias="billingDetails")
    items: list[Item] = Field(alias="items")
    invoice_callback_url: str = Field(alias="invoiceCallbackUrl"),

    @staticmethod
    def from_json_string(json_string: str) -> 'InvoiceRequest':
        json_dict = json.loads(json_string)

        return InvoiceRequest(**json_dict)
