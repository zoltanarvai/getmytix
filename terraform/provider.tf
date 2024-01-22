terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.31.0"
    }
  }

  backend "s3" {
    bucket  = "getmytix-terraform-state"
    region  = "eu-central-1"
    key     = "state/terraform.prod.tfstate"
  }
}

provider "aws" {
  region = var.aws_region
}