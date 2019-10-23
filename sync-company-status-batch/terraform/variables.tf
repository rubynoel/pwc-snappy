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

variable "batch_job_ecr_repo_url" {
  type = string
}

variable "batch_job_ecr_repo_name" {
  type = string
}

variable "batch_job_image_name" {
  type = string
}

variable "batch_name" {
  type = string
}

variable "batch_compute_instance_type" {
  type = string
  default = "t2.micro"
}

variable "batch_job_memory" {
  type = number
  default = 500
}

variable "batch_job_vcpu" {
  type = number
  default = 1
}