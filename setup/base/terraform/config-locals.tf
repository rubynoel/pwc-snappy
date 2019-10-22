locals {
    common_tags = {
      Terraform = "true"
      Environment = "${var.stage}"
      ApplicationId = "${var.application_id}"
  }
}