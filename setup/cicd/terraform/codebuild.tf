resource "aws_iam_role" "codebuild_role" {
  name = "${local.cicd_name_prefix}-codebuild-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
  tags = local.common_tags
}

resource "aws_iam_role_policy" "codebuild_role_policy" {
  role = "${aws_iam_role.codebuild_role.name}"
  name = "${local.cicd_name_prefix}-codebuild-policy"
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Resource": [
        "*"
      ],
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeDhcpOptions",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeVpcs"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterfacePermission"
      ],
      "Resource": [
        "arn:aws:ec2:*:*:network-interface/*"
      ],
      "Condition": {
        "StringEquals": {
          "ec2:Vpc": ["arn:aws:ec2:*:*:vpc/${data.aws_ssm_parameter.vpc_id.value}"]
        }
      }
    },{
      "Effect": "Allow",
      "Action": [
        "ec2:*"
      ],
      "Resource":  "*",
      "Condition": {
        "StringLike": {
          "ec2:Vpc": ["arn:aws:ec2:*:*:vpc/${data.aws_ssm_parameter.vpc_id.value}"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": [
        "${aws_s3_bucket.codepipeline_bucket.arn}",
        "${aws_s3_bucket.codepipeline_bucket.arn}/*"
      ]
    }
  ]
}
POLICY
}

resource "aws_codebuild_project" "codebuild_project" {
  name          = "${local.cicd_name_prefix}-project"
  build_timeout = "5"
  service_role  = "${aws_iam_role.codebuild_role.arn}"

  artifacts {
    type = "CODEPIPELINE"
  }

  cache {
    type     = "S3"
    location = "${aws_s3_bucket.codepipeline_bucket.bucket}"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:1.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    
    environment_variable {
      name  = "STAGE"
      value = "${var.stage}"
    }
    environment_variable {
      name  = "APPLICATION_ID"
      value = "${var.application_id}"
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name = "${local.cicd_name_prefix}-codebuild"
      stream_name = "${local.cicd_name_prefix}-codebuild-stream"
    }

    s3_logs {
      status = "ENABLED"
      location = "${aws_s3_bucket.codepipeline_bucket.id}/build-log"
    }
  }

  source {
    type            = "CODEPIPELINE"
    buildspec       = "sync-company-status-batch/buildspec.yml"
  }

  vpc_config {
    vpc_id = "${data.aws_ssm_parameter.vpc_id.value}"

    subnets = split(",",data.aws_ssm_parameter.param_private_subnet_ids.value)

    security_group_ids = [
      "${data.aws_ssm_parameter.default_security_group_id.value}" #TODO: Create a separate security group for running builds
    ]
  }

  tags = local.common_tags
}
