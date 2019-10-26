resource "aws_codebuild_project" "codebuild_ui_project" {
  name          = "${local.cicd_name_prefix}-ui-project"
  build_timeout = "15"
  service_role  = "${aws_iam_role.codebuild_role.arn}"

  artifacts {
    type = "CODEPIPELINE"
  }

  cache {
    type  = "LOCAL"
    modes = ["LOCAL_DOCKER_LAYER_CACHE"]
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:1.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

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
      group_name  = "${local.cicd_name_prefix}-codebuild-snappy-ui"
      stream_name = "${local.cicd_name_prefix}-codebuild-snappy-ui-stream"
    }

    s3_logs {
      status   = "ENABLED"
      location = "${aws_s3_bucket.codepipeline_bucket.id}/snappy-ui/build-log"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "snappy-ui/buildspec.yml"
  }

  vpc_config {
    vpc_id = "${data.aws_ssm_parameter.vpc_id.value}"

    subnets = split(",", data.aws_ssm_parameter.param_private_subnet_ids.value)

    security_group_ids = [
      "${data.aws_ssm_parameter.default_security_group_id.value}" #TODO: Create a separate security group for running builds
    ]
  }

  tags = local.common_tags
}
