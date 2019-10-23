provider "aws" {
  
}

provider "github" {
  token        = "${var.github_token}"
  organization = "${var.git_org_name}"
}

terraform {
  backend "s3" {}
}