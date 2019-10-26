locals {
  common_tags = {
    Terraform     = "true"
    Environment   = "${var.stage}"
    ApplicationId = "${var.application_id}"
  }
  resource_name_prefix = "${var.application_id}-${var.stage}"
}
