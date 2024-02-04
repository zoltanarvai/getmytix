import logging

from mailersend import emails

from .order import Ticket


class TicketMailer:
    def __init__(self, api_key: str):
        self._api_key = api_key

    def send_ticket(self, recipient_name: str, recipient_email: str, event_name: str,
                    ticket_infos: list[tuple[str, Ticket]]):
        logging.info(f"Sending tickets to {recipient_name} <{recipient_email}>")

        mail = emails.NewEmail(self._api_key)

        sender = {
            "name": "GetMyTix",
            "email": "no-reply@getmytix.io",
        }

        recipients = [
            {
                "name": recipient_name,
                "email": recipient_email,
            }
        ]

        body = {}

        mail.set_mail_from(sender, body)
        mail.set_mail_to(recipients, body)
        mail.set_subject(f"{event_name} jegyek", body)

        mail.set_html_content(self._build_html_content(ticket_infos), body)
        mail.set_plaintext_content(self._build_plaintext_content(ticket_infos), body)

        mail.send(body)

    @staticmethod
    def _build_html_content(ticket_infos: list[tuple[str, Ticket]]) -> str:
        links_html = "".join([f'<li><a href="{url}">{url}</a></li>' for url, ticket in ticket_infos])
        html_content = f"""
        <html>
            <body>
                <p>A jegyek az alabbi linken elerhetoek: </p>
                <ul>
                    {links_html}
                </ul>
            </body>
        </html>
        """
        return html_content

    @staticmethod
    def _build_plaintext_content(ticket_infos: list[tuple[str, Ticket]]) -> str:
        links_text = "\n".join([url for url, ticket in ticket_infos])
        plaintext_content = f"""
        A jegyek az alabbi linken elerhetoek:
        {links_text}
        """

        return plaintext_content
