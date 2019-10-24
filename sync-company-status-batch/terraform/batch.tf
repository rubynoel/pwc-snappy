locals {
    batch_name_prefix = "${var.application_id}-${var.stage}-${var.batch_name}"
}
resource "aws_iam_role" "ecs_instance_role" {
  name = "${local.batch_name_prefix}-role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
        "Service": "ec2.amazonaws.com"
        }
    }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role" {
  role       = "${aws_iam_role.ecs_instance_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_instance_role" {
  name = "${local.batch_name_prefix}-profile"
  role = "${aws_iam_role.ecs_instance_role.name}"
}

resource "aws_iam_role" "aws_batch_service_role" {
  name = "${local.batch_name_prefix}-batch-service-role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
        "Service": "batch.amazonaws.com"
        }
    }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "aws_batch_service_role" {
  role       = "${aws_iam_role.aws_batch_service_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBatchServiceRole"
}

resource "aws_iam_role" "job_container_task_role" {
  name = "${local.batch_name_prefix}-ecs-task-role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
        }
    }
    ]
}
EOF
}

data "template_file" "job_container_task_role_policy_doc" {
  template = "${file("${path.module}/templates/job-ecs-role-policy.tpl")}"

  vars  = {
    application_id = "${var.application_id}"
    stage = "${var.stage}"
  }
}

resource "aws_iam_role_policy" "job_container_task_role_policy" {
  role = "${aws_iam_role.job_container_task_role.name}"
  name = "${local.batch_name_prefix}-job-ecs-task-policy"
  policy = "${data.template_file.job_container_task_role_policy_doc.rendered}"
}

resource "aws_batch_compute_environment" "batch_compute_env" {
  compute_environment_name = "${local.batch_name_prefix}-env"
  
  compute_resources {
    instance_role = "${aws_iam_instance_profile.ecs_instance_role.arn}"

    instance_type = [
      "${var.batch_compute_instance_type}",
    ]

    #parameterize vcpus
    max_vcpus = 5
    min_vcpus = 0

    security_group_ids = [
      "${data.aws_ssm_parameter.default_security_group_id.value}" #TODO: Create a separate security group
    ]

    subnets = split(",",data.aws_ssm_parameter.param_private_subnet_ids.value)

    type = "EC2"
  }

  service_role = "${aws_iam_role.aws_batch_service_role.arn}"
  type         = "MANAGED"
  depends_on   = ["aws_iam_role_policy_attachment.aws_batch_service_role"]
}

resource "aws_batch_job_definition" "batch_job_definition" {
  name = "${local.batch_name_prefix}-job-def"
  type = "container"

  container_properties = <<CONTAINER_PROPERTIES
{
    "command": ["ls", "-la"],
    "image": "${var.batch_job_ecr_repo_url}/${var.batch_job_ecr_repo_name}:${var.batch_job_image_name}",
    "jobRoleArn": "${aws_iam_role.job_container_task_role.arn}",
    "memory": ${var.batch_job_memory},
    "vcpus": ${var.batch_job_vcpu},
    "volumes": [
      {
        "host": {
          "sourcePath": "/tmp"
        },
        "name": "tmp"
      }
    ],
    "environment": [
      {"name": "STAGE", "value": "${var.stage}"},
      {"name": "APPLICATION_ID", "value": "${var.application_id}"},
      {"name": "RESOURCE_REGION", "value": "${var.aws_region}"},
      {"name": "SSM_KEY_DB_ENDPOINT", "value": "${aws_ssm_parameter.rds_postgres_endpoint.name}"},
      {"name": "SSM_KEY_DB_NAME", "value": "${aws_ssm_parameter.rds_postgres_database_name.name}"},
      {"name": "SSM_KEY_DB_PORT", "value": "${aws_ssm_parameter.rds_postgres_database_port.name}"},
      {"name": "SSM_KEY_DB_USER", "value": "${aws_ssm_parameter.rds_postgres_username.name}"},
      {"name": "SSM_KEY_DB_PASSWORD", "value": "${aws_ssm_parameter.rds_postgres_password.name}"}
    ],
    "mountPoints": [
        {
          "sourceVolume": "tmp",
          "containerPath": "/tmp",
          "readOnly": false
        }
    ],
    "ulimits": [
      {
        "hardLimit": 1024,
        "name": "nofile",
        "softLimit": 1024
      }
    ]
}
CONTAINER_PROPERTIES
}

resource "aws_batch_job_queue" "batch_job_queue" {
  name                 = "${local.batch_name_prefix}-job-queue"
  state                = "ENABLED"
  priority             = 1
  compute_environments = ["${aws_batch_compute_environment.batch_compute_env.arn}"]
}