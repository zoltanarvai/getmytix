# syntax=docker/dockerfile:1.4
FROM python:3.11-buster as poetry

RUN pip install --upgrade pip && pip install poetry==1.7.1

ENV POETRY_NO_INTERACTION=1

WORKDIR /build/backend/tickets

FROM poetry as builder

COPY ./poetry.lock    ./poetry.lock
COPY ./pyproject.toml ./pyproject.toml

RUN poetry export --without-hashes -f requirements.txt --output requirements.txt && \
    pip install --no-cache-dir -r requirements.txt --target /build

WORKDIR /build/tickets

RUN rm -rf ./services

COPY ./services ./services
COPY ./app      ./app
COPY ./internal ./internal

FROM python:3.11-buster as assembler

RUN apt-get update && apt-get install -y zip

WORKDIR /app

COPY --from=builder /build /build
RUN cd /build && zip -qr /app/tickets.zip *

FROM scratch AS export
COPY --from=assembler /app /
