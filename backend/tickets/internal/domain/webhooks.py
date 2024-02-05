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

    async def update_ticket(self, ticket_id: str, ticket_callback_url: str, status: Literal['printed'],
                            payload: Optional[dict] = None):
        logging.info(f"Updating ticket {ticket_id} to status {status} with payload {payload}")

        response = await self._httpx_client.post(ticket_callback_url, json={
            "status": status,
            **payload
        })

        if response.status_code != 200:
            logging.error(f"Failed to update ticket {ticket_id} to status {status} with payload {payload}")
            logging.error(f"Response: {response.text}")
            raise Exception(f"Failed to update ticket {ticket_id} to status {status} with payload {payload}")

    async def update_order(self, order_id: str, order_callback_url: str, status: Literal['delivered'],
                           payload: Optional[dict] = {}):
        logging.info(f"Updating order {order_id} to status {status} with payload {payload}")

        response = await self._httpx_client.post(order_callback_url, json={
            "status": status,
            **payload
        })

        if response.status_code != 200:
            logging.error(f"Failed to update order {order_id} to status {status} with payload {payload}")
            logging.error(f"Response: {response.text}")
            raise Exception(f"Failed to update order {order_id} to status {status} with payload {payload}")
