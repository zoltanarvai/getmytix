from tickets.services.generator.handler import Handler

handler = Handler.make_from_env().handle

if __name__ == "__main__":
    payloads = []

    handler(
        {
            'Records': [{
                'messageId': 'ac9ae1a5-acf2-4734-b4bb-9bf76543e522',
                'receiptHandle': 'AQEB4vMrujTlJXv4ISGILODat1XKYzi05WZ74LaxHCNdVc7r5Bjvyj9JXqKcboV1qu2QABNMLVzO7nx4ffs39KttXTWurn8A+UuGs4E0kacyJmWA7LbjSfZbdmvBW16IjyEYqroEU3gzwmf8sJNrsVVOTI0iQG0JbqCwb1k3YgKojhKZa9R5udQO6ELtmBPXmlvbPsnhFVMA78lwXK9wNe82zYrWFmTcg+hgyc/cEMc4SeEKHAcaojRhJ3B1aFQ+VWbXPsj80ua8yZ8NP6mNcqAzS2cD36dIxIpUedrCrUqZ9hskRuV9FHWD0Lf3r057eAsjDi3gW1CAqRe/pn83Y/dnNxWSS/UoXmyi8/3iz5khNgZAe7I761ee24bj+CGBvw5+jFV0JX/h8//jTa9B4i0xk+6tU6BYa/h4uvw0uK9D7dQ=',
                'body': '{"orderId":"65f6dc35411478e1f8f24c06","orderUniqueId":"668af3c9-7d01-4777-8a1f-fe8ebb76dc9c","orderCallbackUrl":"https://getmytix-git-featinvoiceadditions-zoltanarvai.vercel.app/mw/api/orders/65f6dc35411478e1f8f24c06","orderDownloadUrl":"https://getmytix-git-featinvoiceadditions-zoltanarvai.vercel.app/mw/download/668af3c9-7d01-4777-8a1f-fe8ebb76dc9c","tickets":[{"ticketUniqueId":"34443c69-b74a-4131-8bf3-26530485d65f","ticketTypeId":"normal","ticketType":"Normál","ticketId":"65f6dc48be90bc31f4f20bf2","unitPrice":79900,"ticketCode":"1DJQ6M0","ticketCallbackUrl":"https://getmytix-git-featinvoiceadditions-zoltanarvai.vercel.app/mw/api/tickets/65f6dc48be90bc31f4f20bf2","guestName":"","companyName":"","position":""}],"eventDetails":{"id":"65b797f74a356f7ad7ed2322","name":"Évadnyitó Innovációs Konferencia 2024","subdomain":"innovacio2024","logo":"logo","description":"Nyerj betekintést 2024 K+F trendjeibe","notes":"Kerlek idoben erkezzen","startDate":"2024-03-21T07:45:00.000Z","endDate":"2024-03-22T18:00:00.000Z","address":{"street":"Erzsébet tér 7.","city":"Budapest","zipCode":"1051"}},"customerDetails":{"name":"MX Technologies Kft","email":"zoltan.arvai@live.com"}}',
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
