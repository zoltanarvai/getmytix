terraform {
  backend "s3" {
    bucket  = "getmytix-terraform-state"
    region  = "eu-central-1"
    key     = "env:/terraform.tfstate"
  }
  required_version = "1.5.7"
}