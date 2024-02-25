import logging

from httpx import AsyncClient, Limits
from typing import Optional, Literal


class Webhooks:
    def __init__(self, secret: str):
        self._secret = secret
        self._httpx_client = AsyncClient(
            limits=Limits(max_connections=100, max_keepalive_connections=20),
            headers={
                "x-api-key": f"{self._secret}"
            },
        )

    async def update_invoice(self, invoice_id: str, invoice_callback_url: str, payload: Optional[dict] = None):
        logging.info(f"Updating invoice {invoice_id} with payload {payload}")

        response = await self._httpx_client.post(invoice_callback_url, json={
            **payload
        })

        if response.status_code != 200:
            logging.error(f"Failed to update invoice {invoice_id} with payload {payload}")
            logging.error(f"Response: {response.text}")
            raise Exception(f"Failed to update invoice {invoice_id} with payload {payload}")
