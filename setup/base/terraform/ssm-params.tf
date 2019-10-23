locals {
    ssm_param_path_prefix = "/${var.application_id}/${var.stage}"
}

resource "aws_ssm_parameter" "vpc_id" {
  name        = "${local.ssm_param_path_prefix}/vpc-id"
  type        = "String"
  value       = "${module.vpc.vpc_id}"
  overwrite = true
  tags = local.common_tags
}

resource "aws_ssm_parameter" "param_private_subnet_ids" {
  name        = "${local.ssm_param_path_prefix}/private-subnet-ids"
  type        = "String"
  value       = join(",", "${module.vpc.private_subnets}")
  overwrite = true
  tags = local.common_tags
}


resource "aws_ssm_parameter" "public_subnet_ids" {
  name        = "${local.ssm_param_path_prefix}/public-subnet-ids"
  type        = "String"
  value       = join(",", "${module.vpc.public_subnets}")
  overwrite = true
  tags = local.common_tags
}

resource "aws_ssm_parameter" "default_security_group_id" {
  name        = "${local.ssm_param_path_prefix}/default_security_group_id"
  type        = "String"
  value       = "${module.vpc.default_security_group_id}"
  overwrite = true
  tags = local.common_tags
}