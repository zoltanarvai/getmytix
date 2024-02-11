resource "aws_s3_bucket" "tickets" {
  bucket = "tickets-${var.environment}.getmytix.io"

  tags = {
    Name = "tickets-${var.environment}.getmytix.io"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_ownership_controls" "tickets" {
  bucket = aws_s3_bucket.tickets.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "tickets" {
  bucket = aws_s3_bucket.tickets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "tickets" {
  depends_on = [
    aws_s3_bucket_ownership_controls.tickets,
    aws_s3_bucket_public_access_block.tickets,
  ]

  bucket = aws_s3_bucket.tickets.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "tickets" {
  bucket = aws_s3_bucket.tickets.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = ["s3:GetObject"]
        Effect    = "Allow"
        Resource  = [
          "arn:aws:s3:::${aws_s3_bucket.tickets.id}",
          "arn:aws:s3:::${aws_s3_bucket.tickets.id}/*"
        ]
        Principal = "*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "tickets" {
  bucket = aws_s3_bucket.tickets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}

resource "aws_s3_bucket_versioning" "tickets" {
  bucket = aws_s3_bucket.tickets.id

  versioning_configuration {
    status = "Enabled"
  }
}