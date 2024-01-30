data "aws_iam_policy_document" "invoices_queue" {
  statement {
    sid    = ""
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions = [
      "sqs:GetQueueAttributes",
      "sqs:ReceiveMessage",
      "sqs:SendMessage"
    ]

    resources = [
        aws_sqs_queue.invoices_queue.arn,
        aws_sqs_queue.invoices_dlq.arn
    ]
  }
}

resource "aws_sqs_queue" "invoices_dlq" {
  name = "${local.prefix}-invoices-dlq"
}

resource "aws_sqs_queue" "invoices_queue" {
  name = "${local.prefix}-invoices-queue"

  visibility_timeout_seconds = 120

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.invoices_dlq.arn
    maxReceiveCount     = 3
  })
}

