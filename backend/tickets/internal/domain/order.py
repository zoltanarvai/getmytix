import json
from pydantic import BaseModel


class Order(BaseModel):
    id: str

    @staticmethod
    def from_json_string(json_string: str) -> 'Order':
        json_dict = json.loads(json_string)

        return Order(**json_dict)
