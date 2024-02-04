data "aws_iam_policy_document" "ticket_print_queue" {
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
        aws_sqs_queue.ticket_print_queue.arn,
        aws_sqs_queue.ticket_print_dlq.arn
    ]
  }
}

resource "aws_sqs_queue" "ticket_print_dlq" {
  name = "${local.prefix}-tickets-dlq"
}

resource "aws_sqs_queue" "ticket_print_queue" {
  name = "${local.prefix}-tickets-queue"

  visibility_timeout_seconds = 120

  dead_letter_queue {
    max_receive_count = 3
    arn = aws_sqs_queue.ticket_print_dlq.arn
  }

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.ticket_print_dlq.arn
    maxReceiveCount     = 3
  })
}

