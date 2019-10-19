locals {
    common_tags = {
      Terraform = "true"
      Environment = "${var.stage}"
      application_id = "${var.application_id}"
  }
}