provider "aws" {
  assume_role {
    role_arn     = "${var.provisioning_role_arn}"
    session_name = "${var.application_id}_provisioning_session"
  }
}

provider "github" {
  token        = "${var.github_token}"
  organization = "${var.git_org_name}"
}

terraform {
  backend "s3" {}
}