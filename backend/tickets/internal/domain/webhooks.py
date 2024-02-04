import logging

from httpx import AsyncClient
from typing import Optional, Literal


class Webhooks:
    def __init__(self, url: str, secret: str):
        self._url = url

        self._httpx_client = AsyncClient(
            base_url=self._url,
            headers={
                "Authorization": f"{secret}"
            }
        )

    async def update_ticket(self, ticket_id: str, status: Literal['printed'], payload: Optional[dict] = None):
        logging.info(f"Updating ticket {ticket_id} to status {status} with payload {payload}")
        pass

