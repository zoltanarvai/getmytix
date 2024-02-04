import json
from pydantic import BaseModel, Field
from datetime import datetime


class Ticket(BaseModel):
    ticket_type_id: str = Field(alias="ticketTypeId")
    ticket_type: str = Field(alias="ticketType")
    ticket_id: str = Field(alias="ticketId")
    unit_price: int = Field(alias="unitPrice")


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
    tickets: list[Ticket]
    event_details: EventDetails = Field(alias="eventDetails")
    customer_details: CustomerDetails = Field(alias="customerDetails")

    @staticmethod
    def from_json_string(json_string: str) -> 'Order':
        json_dict = json.loads(json_string)

        return Order(**json_dict)


