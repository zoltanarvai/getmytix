locals {
  lambda_invoices_function_handler = "invoices/app/generator/handler.handler"
  lambda_invoices_function_name    = "${local.prefix}-invoices-generator"
  lambda_invoices_source_file      = "${local.base_dir}/backend/invoices/target/invoices.zip"
}

data "aws_iam_policy_document" "lambda_invoices_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_invoices_logs" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "${aws_cloudwatch_log_group.lambda_invoices.arn}:*"
    ]
  }
}

data "aws_iam_policy_document" "lambda_invoices_sqs" {
  statement {
    effect  = "Allow"
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:SendMessage",
      "sqs:GetQueueAttributes",
      "sqs:GetQueueUrl"
    ]
    resources = [
      aws_sqs_queue.invoices_dlq.arn,
      aws_sqs_queue.invoices_queue.arn
    ]
  }
}

resource "aws_iam_role" "lambda_invoices" {
  name               = local.lambda_invoices_function_name
  assume_role_policy = data.aws_iam_policy_document.lambda_invoices_assume_role.json
}

resource "aws_iam_policy" "lambda_invoices_logs" {
  name   = "${local.lambda_invoices_function_name}-logs"
  policy = data.aws_iam_policy_document.lambda_invoices_logs.json
}

resource "aws_iam_policy" "lambda_invoices_sqs" {
  name   = "${local.lambda_invoices_function_name}-sqs"
  policy = data.aws_iam_policy_document.lambda_invoices_sqs.json
}

resource "aws_iam_role_policy_attachment" "lambda_invoices_logs" {
  role       = aws_iam_role.lambda_invoices.name
  policy_arn = aws_iam_policy.lambda_invoices_logs.arn
}


resource "aws_iam_role_policy_attachment" "lambda_invoices_sqs" {
  role       = aws_iam_role.lambda_invoices.name
  policy_arn = aws_iam_policy.lambda_invoices_sqs.arn
}

resource "aws_cloudwatch_log_group" "lambda_invoices" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_invoices.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "lambda_invoices" {
  function_name = local.lambda_invoices_function_name

  role = aws_iam_role.lambda_invoices.arn

  filename         = local.lambda_invoices_source_file
  handler          = local.lambda_invoices_function_handler
  source_code_hash = filebase64sha256(local.lambda_invoices_source_file)

  runtime = "python3.11"

  environment {
    variables = {
      INVOICES_DLQ_URL  = aws_sqs_queue.invoices_dlq.url
      INVOICE_AGENT_KEY = var.invoices_api_key
      WEBHOOKS_SECRET   = var.getmytix_webhook_secret
    }
  }

  memory_size = 1024
  timeout     = 60
}

resource "aws_lambda_event_source_mapping" "invoices_queue_generator_lambda" {
  event_source_arn = aws_sqs_queue.invoices_queue.arn
  function_name    = aws_lambda_function.lambda_invoices.arn
  batch_size       = 1
}