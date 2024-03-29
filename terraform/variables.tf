variable "environment" {
  type        = string
  description = "ID element. Usually used to indicate role, e.g. 'prod', 'uat', 'dev', 'local'"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "mailer_send_api_key" {
  type        = string
  description = "API key for mailer send service"
}

variable "getmytix_webhook_secret" {
  type        = string
  description = "Secret for the webhook URL"
}

variable "invoices_api_key" {
  type        = string
  description = "API key for invoices service"
}