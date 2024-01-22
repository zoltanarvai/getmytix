import base64
import json

from tickets.services.generator.handler import Handler

handler = Handler.make_from_env().handle

if __name__ == "__main__":
    payloads = []

    handler(
        {
            "eventSource": "aws:sqs",
            "eventSourceArn": "arn:aws:sqs:eu-central-1:000000000000:b379b9bf-a46e-4615-a22b-21b6ace0e8a0-25",
            "records": {
                "source-ci-media-intake-reader-clips-1": [
                    {
                        "topic": "augmented-content-analysis-object-stream",
                        "partition": idx % 3,
                        "offset": idx % 3,
                        "timestamp": 1700834257512,
                        "timestampType": "CREATE_TIME",
                        "value": base64.b64encode(json.dumps(item).encode()).decode()
                    } for idx, item in enumerate(payloads)
                ]
            }
        }, None)
