locals {
    db_name_prefix = "${var.application_id}-${var.stage}"
}

module "rds_postgres" {
  source  = "terraform-aws-modules/rds/aws"

  identifier = "${local.db_name_prefix}-db"

  engine            = "postgres"
  engine_version    = "9.6.9"
  instance_class    = "db.t2.micro"
  allocated_storage = 5
  storage_encrypted = false
  name = "${var.rds_db_name}"

  username = "${var.rds_username}"
  password = "${var.rds_password}"
  port     = "5432"

  vpc_security_group_ids = ["${data.aws_ssm_parameter.default_security_group_id.value}"]

  #TODO: parameterize this
  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"
  backup_retention_period = 7

  tags = local.common_tags

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # DB subnet group
  subnet_ids = split(",",data.aws_ssm_parameter.param_private_subnet_ids.value)

  # DB parameter group.
  #TODO: parameterize this
  family = "postgres9.6"

  # DB option group
  major_engine_version = "9.6"

  #Database Deletion Protection
  deletion_protection = var.rds_db_deletion_protection

  # Snapshot name upon DB deletion
  final_snapshot_identifier = "${local.db_name_prefix}-db-final-snap"
  
  }