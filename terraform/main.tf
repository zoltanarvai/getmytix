locals {
  environment = var.environment
  project     = "getmytix"
  base_dir    = abspath("${path.root}/../")
  prefix      = "${local.project}-${local.environment}"

  aws_provider = {
    region = var.aws_region

    tags = {
      Project     = local.project
      environment = local.environment
      CreatedBy   = "terraform"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}