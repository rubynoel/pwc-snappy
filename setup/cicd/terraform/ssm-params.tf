locals {
    ssm_param_path_prefix = "/${var.application_id}/${var.stage}"
}

data "aws_ssm_parameter" "vpc_id" {
  name  = "${local.ssm_param_path_prefix}/vpc-id"
}

data "aws_ssm_parameter" "param_private_subnet_ids" {
  name  = "${local.ssm_param_path_prefix}/private-subnet-ids"
}


data "aws_ssm_parameter" "public_subnet_ids" {
  name  = "${local.ssm_param_path_prefix}/public-subnet-ids"
}

data "aws_ssm_parameter" "default_security_group_id" {
  name  = "${local.ssm_param_path_prefix}/default_security_group_id"
}