from invoices.services.generator.handler import Handler

handler = Handler.make_from_env().handle

if __name__ == "__main__":
    payloads = []

    handler(
        {
            'Records': [{
                'messageId': 'ac9ae1a5-acf2-4734-b4bb-9bf76543e522',
                'receiptHandle': 'AQEB4vMrujTlJXv4ISGILODat1XKYzi05WZ74LaxHCNdVc7r5Bjvyj9JXqKcboV1qu2QABNMLVzO7nx4ffs39KttXTWurn8A+UuGs4E0kacyJmWA7LbjSfZbdmvBW16IjyEYqroEU3gzwmf8sJNrsVVOTI0iQG0JbqCwb1k3YgKojhKZa9R5udQO6ELtmBPXmlvbPsnhFVMA78lwXK9wNe82zYrWFmTcg+hgyc/cEMc4SeEKHAcaojRhJ3B1aFQ+VWbXPsj80ua8yZ8NP6mNcqAzS2cD36dIxIpUedrCrUqZ9hskRuV9FHWD0Lf3r057eAsjDi3gW1CAqRe/pn83Y/dnNxWSS/UoXmyi8/3iz5khNgZAe7I761ee24bj+CGBvw5+jFV0JX/h8//jTa9B4i0xk+6tU6BYa/h4uvw0uK9D7dQ=',
                'body': '{"id": "65db28da7fdcd681b8197abf", "orderId":"65db25df7fdcd681b8197abb","invoiceDate":"2024-02-25","invoicePrefix":"FITIX","seller":{"bank":"MKB BANK ZRT. SWIFT KÓD: MKKBHUHB","accountNumber":"HU60 10300002-20108698-48820019"},"billingDetails":{"name":"MX Technologies Kft","taxNumber":"12345678-1-12","address":"Magyar utca 38/a","email":"zoltan.arvai@live.com","city":"Budapest","zip":"1053"},"items":[{"itemId":"abc123","itemType":"Standard","quantity":2,"unitPrice":19999},{"itemId":"abc345","itemType":"VIP","quantity":1,"unitPrice":39999}],"invoiceCallbackUrl":"http://api.localhost:3000/invoices/785d95db-044e-49b1-a484-d88f8f8a9e59"}',
                'attributes': {
                    'ApproximateReceiveCount': '1',
                    'SentTimestamp': '1707127817825',
                    'SenderId': '152320933786',
                    'ApproximateFirstReceiveTimestamp': '1707127817832'
                },
                'messageAttributes': {},
                'md5OfBody': '9953b7b9a37e8b76c7fa85342563b0ad', 'eventSource': 'aws:sqs',
                'eventSourceARN': 'arn:aws:sqs:eu-central-1:152320933786:getmytix-prod-invoices-queue',
                'awsRegion': 'eu-central-1'
            }]
        }, None)
