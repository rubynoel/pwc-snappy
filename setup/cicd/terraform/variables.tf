variable "application_id" {
  type = string
}

variable "aws_account_id" {
  type = string
}


variable "provisioning_role_arn" {
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

variable "github_token" {
  type = string
}

variable "git_org_name" {
  type = string
  default = "rubynoel"
}

variable "git_repo_name" {
  type = string
  default = "pwc-snappy"
}

variable "git_branch" {
  type = string
  default = "master"
}