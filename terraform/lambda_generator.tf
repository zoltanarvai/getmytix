locals {
  lambda_generator_function_handler = "tickets/app/generator/handler.handler"
  lambda_generator_function_name    = "${local.prefix}-ticket-generator"
  lambda_generator_source_file      = "${local.base_dir}/backend/tickets/target/tickets.zip"
}

data "aws_iam_policy_document" "lambda_generator_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_generator_logs" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "${aws_cloudwatch_log_group.lambda_generator.arn}:*"
    ]
  }
}

data "aws_iam_policy_document" "lambda_generator_s3" {
    statement {
        effect  = "Allow"
        actions = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        resources = [
          aws_s3_bucket.tickets.arn,
          "${aws_s3_bucket.tickets.arn}/*"
        ]
    }

}

data "aws_iam_policy_document" "lambda_generator_sqs" {
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
      aws_sqs_queue.ticket_print_dlq.arn,
      aws_sqs_queue.ticket_print_queue.arn
    ]
  }
}

resource "aws_iam_role" "lambda_generator" {
  name               = local.lambda_generator_function_name
  assume_role_policy = data.aws_iam_policy_document.lambda_generator_assume_role.json
}

resource "aws_iam_policy" "lambda_generator_logs" {
  name   = "${local.lambda_generator_function_name}-logs"
  policy = data.aws_iam_policy_document.lambda_generator_logs.json
}

resource "aws_iam_policy" "lambda_generator_s3" {
  name   = "${local.lambda_generator_function_name}-s3"
  policy = data.aws_iam_policy_document.lambda_generator_s3.json
}

resource "aws_iam_policy" "lambda_generator_sqs" {
  name   = "${local.lambda_generator_function_name}-sqs"
  policy = data.aws_iam_policy_document.lambda_generator_sqs.json
}

resource "aws_iam_role_policy_attachment" "lambda_generator_logs" {
  role       = aws_iam_role.lambda_generator.name
  policy_arn = aws_iam_policy.lambda_generator_logs.arn
}

resource "aws_iam_role_policy_attachment" "lambda_generator_s3" {
  role       = aws_iam_role.lambda_generator.name
  policy_arn = aws_iam_policy.lambda_generator_s3.arn
}

resource "aws_iam_role_policy_attachment" "lambda_generator_sqs" {
  role       = aws_iam_role.lambda_generator.name
  policy_arn = aws_iam_policy.lambda_generator_sqs.arn
}

resource "aws_cloudwatch_log_group" "lambda_generator" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_generator.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "lambda_generator" {
  function_name = local.lambda_generator_function_name

  role = aws_iam_role.lambda_generator.arn

  filename         = local.lambda_generator_source_file
  handler          = local.lambda_generator_function_handler
  source_code_hash = filebase64sha256(local.lambda_generator_source_file)

  runtime = "python3.11"

  environment {
    variables = {
      TICKET_PRINT_QUEUE_DLQ_URL = aws_sqs_queue.ticket_print_dlq.url
      TICKETS_BUCKET_NAME        = aws_s3_bucket.tickets.bucket
      MAILER_SEND_API_KEY        = var.mailer_send_api_key
      WEBHOOKS_SECRET            = var.getmytix_webhook_secret
    }
  }

  memory_size = 1024
  timeout     = 60
}

resource "aws_lambda_event_source_mapping" "ticket_print_queue_generator_lambda" {
  event_source_arn = aws_sqs_queue.ticket_print_queue.arn
  function_name    = aws_lambda_function.lambda_generator.arn
  batch_size       = 1
}