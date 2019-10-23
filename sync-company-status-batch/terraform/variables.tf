variable "application_id" {
  type = string
}

variable "aws_account_id" {
  type = string
}

variable "stage" {
  type = string
}

variable "s3_backend_name" {
  type = string
}

variable "s3_kms_key_id" {
  type = string
}

variable "aws_region" {
  type = string
  default = "ap-southeast-2"
}

variable "batch_application_ecr_repo_url" {
  type = string
}

variable "batch_application_ecr_repo_name" {
  type = string
}