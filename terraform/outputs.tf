output "tickets_queue_url" {
  value = aws_sqs_queue.ticket_print_queue.url
}

output "invoices_queue_url" {
  value = aws_sqs_queue.invoices_queue.url
}