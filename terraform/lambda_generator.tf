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

resource "aws_iam_role" "lambda_augmented_cao_to_sns" {
  name               = local.lambda_generator_function_name
  assume_role_policy = data.aws_iam_policy_document.lambda_generator_assume_role.json
}

resource "aws_iam_policy" "lambda_generator_logs" {
  name   = "${local.lambda_generator_function_name}-logs"
  policy = data.aws_iam_policy_document.lambda_generator_logs.json
}

resource "aws_iam_role_policy_attachment" "lambda_augmented_cao_to_sns_logs" {
  role       = aws_iam_role.lambda_augmented_cao_to_sns.name
  policy_arn = aws_iam_policy.lambda_generator_logs.arn
}

resource "aws_cloudwatch_log_group" "lambda_generator" {
  name              = "/aws/lambda/${aws_lambda_function.augmented_cao_to_sns.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "augmented_cao_to_sns" {
  function_name = local.lambda_generator_function_name

  role = aws_iam_role.lambda_augmented_cao_to_sns.arn

  filename         = local.lambda_generator_source_file
  handler          = local.lambda_generator_function_handler
  source_code_hash = filebase64sha256(local.lambda_generator_source_file)

  runtime = "python3.11"

  memory_size = 1024
  timeout     = 60
}