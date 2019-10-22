locals {
    cicd_name_prefix = "${var.application_id}-${var.stage}"
    github_webhook_secret = "super-secret"
}
resource "aws_s3_bucket" "codepipeline_bucket" {
  bucket = "${local.cicd_name_prefix}-codepipeline"
  acl    = "private"
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = "${var.s3_kms_key_id}"
        sse_algorithm     = "aws:kms"
      }
    }
  }
  tags = local.common_tags
}

resource "aws_iam_role" "codepipeline_role" {
  name = "${local.cicd_name_prefix}-codepipeline-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
  tags = local.common_tags
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  role = "${aws_iam_role.codepipeline_role.id}"
  name = "${local.cicd_name_prefix}-codepipeline-policy"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:PutObject"
      ],
      "Resource": [
        "${aws_s3_bucket.codepipeline_bucket.arn}",
        "${aws_s3_bucket.codepipeline_bucket.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

data "github_repository" "source_repo" {
  name = "${var.git_repo_name}"
}

resource "aws_codepipeline_webhook" "codepipeline_webhook" {
  name            = "${local.cicd_name_prefix}-github-webhook"
  authentication  = "GITHUB_HMAC"
  target_action   = "Source"
  target_pipeline = "${aws_codepipeline.pipeline.name}"

  authentication_configuration {
    secret_token = "${local.github_webhook_secret}"
  }

  filter {
    json_path    = "$.ref"
    match_equals = "refs/heads/{Branch}/setup"
  }
}

resource "github_repository_webhook" "github_webhook" {
  repository = "${data.github_repository.source_repo.name}"

  configuration {
    url          = "${aws_codepipeline_webhook.codepipeline_webhook.url}"
    content_type = "json"
    insecure_ssl = true
    secret       = "${local.github_webhook_secret}"
  }

  events = ["push"]
}

resource "aws_codepipeline" "pipeline" {
  name     = "${local.cicd_name_prefix}-pipeline"
  role_arn = "${aws_iam_role.codepipeline_role.arn}"

  artifact_store {
    location = "${aws_s3_bucket.codepipeline_bucket.bucket}"
    type     = "S3"
  }

  tags = local.common_tags

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        Owner  = "${var.git_org_name}"
        Repo   = "${var.git_repo_name}"
        Branch = "${var.git_branch}"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"

      configuration = {
        ProjectName = "${aws_codebuild_project.codebuild_project.name}"
      }
    }
  }

}