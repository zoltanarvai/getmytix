import json
from pydantic import BaseModel, Field
from datetime import datetime


class Ticket(BaseModel):
    ticket_unique_id: str = Field(alias="ticketUniqueId")
    ticket_type_id: str = Field(alias="ticketTypeId")
    ticket_type: str = Field(alias="ticketType")
    ticket_id: str = Field(alias="ticketId")
    guest_name: str = Field(alias="guestName")
    company_name: str = Field(alias="companyName")
    position: str = Field(alias="position")
    unit_price: int = Field(alias="unitPrice")
    ticket_code: str = Field(alias="ticketCode")
    ticket_callback_url: str = Field(alias="ticketCallbackUrl")


class Address(BaseModel):
    street: str
    city: str
    zip_code: str = Field(alias="zipCode")

    def to_location(self):
        return f"{self.street}, {self.city}, {self.zip_code}"


class EventDetails(BaseModel):
    id: str = Field(alias="id")
    name: str
    logo: str
    description: str
    notes: str
    start_date: datetime = Field(alias="startDate")
    end_date: datetime = Field(alias="endDate")
    address: Address


class CustomerDetails(BaseModel):
    name: str
    email: str


class Order(BaseModel):
    order_id: str = Field(alias="orderId")
    order_unique_id: str = Field(alias="orderUniqueId")
    order_callback_url: str = Field(alias="orderCallbackUrl")
    order_download_url: str = Field(alias="orderDownloadUrl")
    tickets: list[Ticket]
    event_details: EventDetails = Field(alias="eventDetails")
    customer_details: CustomerDetails = Field(alias="customerDetails")

    @staticmethod
    def from_json_string(json_string: str) -> 'Order':
        json_dict = json.loads(json_string)

        return Order(**json_dict)


