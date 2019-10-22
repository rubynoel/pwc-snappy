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

variable "availability_zone_names" {
  type = list(string)
  default = ["ap-southeast-2a","ap-southeast-2b","ap-southeast-2c"]
 }

variable "vpc_cidr" {
  type = string
  default = "20.0.0.0/16"
}

variable "private_subnets_cidr" {
  type = list(string)
  default = ["20.0.1.0/24", "20.0.2.0/24", "20.0.3.0/24"]
}

variable "public_subnets_cidr" {
  type = list(string)
  default = ["20.0.101.0/24", "20.0.102.0/24", "20.0.103.0/24"]
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