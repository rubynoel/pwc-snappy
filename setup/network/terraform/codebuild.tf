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
}

resource "aws_iam_role_policy" "codebuild_role_policy" {
  role = "${aws_iam_role.codebuild_role.name}"

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
        "arn:aws:ec2:${var.aws_region}:${var.aws_account_id}:network-interface/*"
      ],
      "Condition": {
        "StringEquals": {
          "ec2:Subnet": [${join(",",module.vpc.private_subnets)}],
          "ec2:AuthorizedService": "codebuild.amazonaws.com"
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
    type = "NO_ARTIFACTS"
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
      name  = "SOME_KEY1"
      value = "SOME_VALUE1"
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
  }

  vpc_config {
    vpc_id = "${module.vpc.vpc_id}"

    subnets = module.vpc.private_subnets

    security_group_ids = [
      "${module.vpc.default_vpc_default_security_group_id}" #TODO: Create a separate security group for running builds
    ]
  }

  tags = local.common_tags
}
