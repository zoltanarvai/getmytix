import logging

from mailersend import emails

from .order import Order


class TicketMailer:
    def __init__(self, api_key: str):
        self._api_key = api_key

    def send_tickets(self, order: Order):
        logging.info(f"Sending tickets to {order.customer_details.name} <{order.customer_details.email}>")

        mail = emails.NewEmail(self._api_key)

        sender = {
            "name": "GetMyTix",
            "email": "no-reply@getmytix.io",
        }

        recipients = [
            {
                "name": order.customer_details.name,
                "email": order.customer_details.email,
            }
        ]

        personalization = [
            {
                "email": "recipient@email.com",
                "data": {
                    "order": {
                        "order_number": order.order_unique_id,
                    },
                    "customer": {
                        "name": order.customer_details.name,
                    }
                }
            }
        ]

        body = {}

        mail.set_mail_from(sender, body)
        mail.set_mail_to(recipients, body)
        mail.set_subject(f"{order.event_details.name} jegyek", body)
        mail.set_template("o65qngkxvzj4wr12", body)
        mail.set_advanced_personalization(personalization, body)

        mail.send(body)
