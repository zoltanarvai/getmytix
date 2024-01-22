variable "environment" {
  type        = string
  description = "ID element. Usually used to indicate role, e.g. 'prod', 'uat', 'dev', 'local'"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
}