provider "aws" {
  assume_role {
    role_arn     = "${var.provisioning_role_arn}"
    session_name = "${var.application_id}_provisioning_session"
  }
}

terraform {
  backend "s3" {}
}