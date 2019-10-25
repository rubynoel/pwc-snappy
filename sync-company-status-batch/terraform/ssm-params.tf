locals {
  ssm_param_path_prefix = "/${var.application_id}/${var.stage}"
}

data "aws_ssm_parameter" "vpc_id" {
  name = "${local.ssm_param_path_prefix}/vpc-id"
}

data "aws_ssm_parameter" "param_private_subnet_ids" {
  name = "${local.ssm_param_path_prefix}/private-subnet-ids"
}


data "aws_ssm_parameter" "public_subnet_ids" {
  name = "${local.ssm_param_path_prefix}/public-subnet-ids"
}

data "aws_ssm_parameter" "default_security_group_id" {
  name = "${local.ssm_param_path_prefix}/default_security_group_id"
}

# TODO: Add a separate kms key for db secrets. For now, encrypting database secrets using the default kms key
resource "aws_ssm_parameter" "rds_postgres_endpoint" {
  name      = "${local.ssm_param_path_prefix}/rds/endpoint"
  type      = "SecureString"
  value     = "${module.rds_postgres.this_db_instance_endpoint}"
  overwrite = true
  tags      = local.common_tags
}

resource "aws_ssm_parameter" "rds_postgres_address" {
  name      = "${local.ssm_param_path_prefix}/rds/address"
  type      = "SecureString"
  value     = "${module.rds_postgres.this_db_instance_address}"
  overwrite = true
  tags      = local.common_tags
}

resource "aws_ssm_parameter" "rds_postgres_database_name" {
  name      = "${local.ssm_param_path_prefix}/rds/database_name"
  type      = "SecureString"
  value     = "${module.rds_postgres.this_db_instance_name}"
  overwrite = true
  tags      = local.common_tags
}

resource "aws_ssm_parameter" "rds_postgres_database_port" {
  name      = "${local.ssm_param_path_prefix}/rds/port"
  type      = "SecureString"
  value     = "${module.rds_postgres.this_db_instance_port}"
  overwrite = true
  tags      = local.common_tags
}

resource "aws_ssm_parameter" "rds_postgres_username" {
  name      = "${local.ssm_param_path_prefix}/rds/username/master"
  type      = "SecureString"
  value     = "${module.rds_postgres.this_db_instance_username}"
  overwrite = true
  tags      = local.common_tags
}

resource "aws_ssm_parameter" "rds_postgres_password" {
  name      = "${local.ssm_param_path_prefix}/rds/password/master"
  type      = "SecureString"
  value     = "${module.rds_postgres.this_db_instance_password}"
  overwrite = true
  tags      = local.common_tags
}
