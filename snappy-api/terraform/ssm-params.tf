locals {
  ssm_param_path_prefix = "/${var.application_id}/${var.stage}"
}

data "aws_ssm_parameter" "param_private_subnet_ids" {
  name = "${local.ssm_param_path_prefix}/private-subnet-ids"
}

data "aws_ssm_parameter" "default_security_group_id" {
  name = "${local.ssm_param_path_prefix}/default_security_group_id"
}

data "aws_ssm_parameter" "rds_postgres_endpoint" {
  name = "${local.ssm_param_path_prefix}/rds/endpoint"
}

data "aws_ssm_parameter" "rds_postgres_address" {
  name = "${local.ssm_param_path_prefix}/rds/address"
}

data "aws_ssm_parameter" "rds_postgres_database_name" {
  name = "${local.ssm_param_path_prefix}/rds/database_name"
}

data "aws_ssm_parameter" "rds_postgres_database_port" {
  name = "${local.ssm_param_path_prefix}/rds/port"
}

data "aws_ssm_parameter" "rds_postgres_username" {
  name = "${local.ssm_param_path_prefix}/rds/username/master"
}

data "aws_ssm_parameter" "rds_postgres_password" {
  name = "${local.ssm_param_path_prefix}/rds/password/master"
}
