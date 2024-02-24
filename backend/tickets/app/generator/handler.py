from tickets.services.generator.handler import Handler

handler = Handler.make_from_env().handle

if __name__ == "__main__":
    payloads = []

    handler(
        {
            'Records': [{
                'messageId': 'ac9ae1a5-acf2-4734-b4bb-9bf76543e522',
                'receiptHandle': 'AQEB4vMrujTlJXv4ISGILODat1XKYzi05WZ74LaxHCNdVc7r5Bjvyj9JXqKcboV1qu2QABNMLVzO7nx4ffs39KttXTWurn8A+UuGs4E0kacyJmWA7LbjSfZbdmvBW16IjyEYqroEU3gzwmf8sJNrsVVOTI0iQG0JbqCwb1k3YgKojhKZa9R5udQO6ELtmBPXmlvbPsnhFVMA78lwXK9wNe82zYrWFmTcg+hgyc/cEMc4SeEKHAcaojRhJ3B1aFQ+VWbXPsj80ua8yZ8NP6mNcqAzS2cD36dIxIpUedrCrUqZ9hskRuV9FHWD0Lf3r057eAsjDi3gW1CAqRe/pn83Y/dnNxWSS/UoXmyi8/3iz5khNgZAe7I761ee24bj+CGBvw5+jFV0JX/h8//jTa9B4i0xk+6tU6BYa/h4uvw0uK9D7dQ=',
                'body': '{"orderId":"65da4aa12281a00eb48e967c","orderUniqueId":"fe0fae90-ef8c-486b-9788-c426f06fa264","orderCallbackUrl":"http://sailwithus.localhost:3000/api/orders/65c0b08ba587c1ac6e34d533","tickets":[{"ticketUniqueId":"f212b86e-057b-442d-b37a-4fddfe116456","ticketTypeId":"abc123","ticketType":"Standard","ticketId":"65da4aa62281a00eb48e967d","unitPrice":19999,"ticketCode":"EBPW9N8","ticketCallbackUrl": "http://sailwithus.localhost:3000/api/tickets/65da4aa62281a00eb48e967d","guestName":"Arvai Zoltan","companyName":"Mx Technologies Kft","position":"Software Developer"},{"ticketUniqueId":"8e253408-100b-4061-95f0-0deac5854bb0","ticketTypeId":"abc123","ticketType":"Standard","ticketId":"65da4aa62281a00eb48e967e","unitPrice":19999,"ticketCode":"YMD5QV8","ticketCallbackUrl":"http://api.localhost:3000/tickets/65da4aa62281a00eb48e967e","guestName":"Orosz Gabor","companyName":"MediaWorks Kft","position":"Head of Engineering"},{"ticketUniqueId":"7c721825-6452-433f-ac99-6b1ca95453bf","ticketTypeId":"abc345","ticketType":"VIP","ticketId":"65da4aa62281a00eb48e967f","unitPrice":39999,"ticketCode":"JXSYDGR","ticketCallbackUrl":"http://api.localhost:3000/tickets/65da4aa62281a00eb48e967f","guestName":"","companyName":"","position":""}],"eventDetails":{"id":"65b797f74a356f7ad7ed2322","name":"Vitorlázás 2024","subdomain":"sailwithus","logo":"logo","description":"Tölts velünk egy izgalmas, networking eseményt","notes":"Kerlek idoben erkezzen","startDate":"2024-06-01T10:00:00.000Z","endDate":"2024-06-01T18:00:00.000Z","address":{"street":"Marina kikötő","city":"Balatonfüred","zipCode":"2085"}},"customerDetails":{"name":"Zoltan Arvai","email":"zoltan.arvai@live.com"}}',
                'attributes': {
                    'ApproximateReceiveCount': '1',
                    'SentTimestamp': '1707127817825',
                    'SenderId': '152320933786',
                    'ApproximateFirstReceiveTimestamp': '1707127817832'
                },
                'messageAttributes': {},
                'md5OfBody': '9953b7b9a37e8b76c7fa85342563b0ad', 'eventSource': 'aws:sqs',
                'eventSourceARN': 'arn:aws:sqs:eu-central-1:152320933786:getmytix-prod-tickets-queue',
                'awsRegion': 'eu-central-1'
            }]
        }, None)
