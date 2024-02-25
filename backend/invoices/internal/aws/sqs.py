from pydantic import BaseModel, Field


class SqsRecord(BaseModel):
    message_id: str = Field(alias='messageId')
    receipt_handle: str = Field(alias='receiptHandle')
    body: str
    attributes: dict
    message_attributes: dict = Field(alias='messageAttributes')
    md5_of_body: str = Field(alias='md5OfBody')
    event_source: str = Field(alias='eventSource')
    event_source_arn: str = Field(alias='eventSourceARN')
    aws_region: str = Field(alias='awsRegion')


class SqsEvent(BaseModel):
    records: list[SqsRecord] = Field(alias='Records')

    @staticmethod
    def parse(input_event: any) -> 'SqsEvent':
        event = SqsEvent.model_validate(input_event)

        return event
