from tickets.services.generator.handler import Handler

handler = Handler.make_from_env().handle

if __name__ == "__main__":
    payloads = []

    handler(
        {
            'Records': [
                {
                    'messageId': 'add0727c-507a-4d68-9a1e-8cd5ea57f223',
                    'receiptHandle': 'AQEB6Gdx3R3gVikpnQLuKXedg8alihRX0h9WA5JhK...=',
                    'body': '{"id": "1", "name": "test"}',
                    'attributes': {
                        'ApproximateReceiveCount': '1',
                        'SentTimestamp': '1705955753256',
                        'SenderId': '152320933786',
                        'ApproximateFirstReceiveTimestamp': '1705955753260'
                    },
                    'messageAttributes': {},
                    'md5OfBody': '098f6bcd4621d373cade4e832627b4f6',
                    'eventSource': 'aws:sqs',
                    'eventSourceARN': 'arn:aws:sqs:eu-central-1:152320933786:getmytix-prod-tickets-queue',
                    'awsRegion': 'eu-central-1'
                }
            ]
        }, None)
