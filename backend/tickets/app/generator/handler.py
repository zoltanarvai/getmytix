from tickets.services.generator.handler import Handler

handler = Handler.make_from_env().handle

if __name__ == "__main__":
    payloads = []

    handler(
        {
            'Records': [
                {
                    'messageId': '8dc0135e-8bdf-4667-856e-f99ab9a984cc',
                    'receiptHandle': 'AQEBtbY/hxJryf0JIpyvaI6H4stLAe8sKYR6VS885GjT/SDraMFbLWbwQlYQScrqac/48ODdJQ1icjMtshjgNUYxuI/4vCqf75huY9LUKH9Rz2sOd8MSQ8vNckbAc59F/kSKwJlYI3aYwIK/x2mMrlC+um3bMRSkGrBBMB9UVugzjMxh8QiLXVuLGvwO8oiEPqyg0CJRtPZDRbZIXxiPOIFVfc4ro6ILPNg87xBqZu3jGe6564jSspuT00gYEW34BJ9aFWDxBYoBxXvHDv3qRbca79VrevcmREM0YsBhbmu0/rsY8p/ML/C062u7aR5f17RdY0DobbDqgn3V3bcYjnMUmq1koV4sKoAEJvikuM16KpxBMNWgeUeY/pZ4WEUh02BSPEkak0GRNZIGY0KooN/DQ5nr1vLeQZUae8tcqHLI1LU=',
                    'body': '{"orderId":"65bfef71ac32e7ca2256e865","tickets":[{"ticketTypeId":"abc123","ticketType":"Standard","ticketId":"65bfef76ac32e7ca2256e866","unitPrice":19999},{"ticketTypeId":"abc123","ticketType":"Standard","ticketId":"65bfef76ac32e7ca2256e867","unitPrice":19999},{"ticketTypeId":"abc345","ticketType":"VIP","ticketId":"65bfef76ac32e7ca2256e868","unitPrice":39999},{"ticketTypeId":"def789","ticketType":"Free","ticketId":"65bfef76ac32e7ca2256e869","unitPrice":0},{"ticketTypeId":"def789","ticketType":"Free","ticketId":"65bfef76ac32e7ca2256e86a","unitPrice":0}],"eventDetails":{"id": "123", "name":"Vitorlázás 2024","logo":"logo","description":"Tölts velünk egy izgalmas, networking eseményt","notes":"Kerlek idoben erkezzen","startDate":"2024-06-01T10:00:00.000Z","endDate":"2024-06-01T18:00:00.000Z","address":{"street":"Marina kikötő","city":"Balatonfüred","zipCode":"2085"}},"customerDetails":{"name":"Zoltan Arvai","email":"zoltan.arvai@live.com"}}',
                    'attributes': {
                        'ApproximateReceiveCount': '1',
                        'SentTimestamp': '1707077494758',
                        'SenderId': 'AIDASG5YI76NDVMRXWT2D',
                        'ApproximateFirstReceiveTimestamp': '1707077494766'
                    },
                    'messageAttributes': {},
                    'md5OfBody': '56b83c8827fa1590ffb81204cf11135a', 'eventSource': 'aws:sqs',
                    'eventSourceARN': 'arn:aws:sqs:eu-central-1:152320933786:getmytix-prod-tickets-queue',
                    'awsRegion': 'eu-central-1'
                }
            ]
        }, None)
