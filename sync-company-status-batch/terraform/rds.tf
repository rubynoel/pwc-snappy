locals {
  db_name_prefix = "${var.application_id}-${var.stage}"
}

module "rds_postgres" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "${local.db_name_prefix}-company-db"

  engine            = "postgres"
  engine_version    = "11.5"
  instance_class    = "db.t2.micro"
  allocated_storage = 5
  storage_encrypted = false
  name              = "${var.rds_db_name}"

  username = "${var.rds_username}"
  password = "${var.rds_password}"
  port     = "5432"

  vpc_security_group_ids = ["${data.aws_ssm_parameter.default_security_group_id.value}"]

  #TODO: parameterize this
  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = 7

  tags = local.common_tags

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # DB subnet group
  subnet_ids = split(",", data.aws_ssm_parameter.param_private_subnet_ids.value)

  # DB parameter group.
  #TODO: parameterize this
  family = "postgres11"

  # DB option group
  major_engine_version = "11.5"

  #Database Deletion Protection
  deletion_protection = var.rds_db_deletion_protection

  # Snapshot name upon DB deletion
  final_snapshot_identifier = "${local.db_name_prefix}-db-final-snap"

}

resource "aws_iam_role" "rds_s3Import_role" {
  name = "${local.batch_name_prefix}-rds-s3-role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
          "Service": "rds.amazonaws.com"
        }
    }
    ]
}
EOF
}

data "template_file" "rds_s3Import_role_policy_doc" {
  template = "${file("${path.module}/templates/rds-s3-role-policy.tpl")}"

  vars = {
    application_id = "${var.application_id}"
    stage          = "${var.stage}"
  }
}

resource "aws_iam_role_policy" "rds_s3Import_role_policy" {
  role   = "${aws_iam_role.rds_s3Import_role.name}"
  name   = "${local.batch_name_prefix}-rds-s3-role-policy"
  policy = "${data.template_file.rds_s3Import_role_policy_doc.rendered}"
}

resource "aws_db_instance_role_association" "rds_postgres_s3Import_role_association" {
  db_instance_identifier = "${module.rds_postgres.this_db_instance_id}"
  feature_name           = "s3Import"
  role_arn               = "${aws_iam_role.rds_s3Import_role.arn}"
}