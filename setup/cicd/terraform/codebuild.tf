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
  tags               = local.common_tags
}

# TODO: Some statements in the code build role policy template grant more permissions than needed. Change to more restrictive permissions.
data "template_file" "codebuild_role_policy_doc" {
  template = "${file("${path.module}/templates/codebuild-role-policy.tpl")}"

  vars = {
    application_id          = "${var.application_id}"
    stage                   = "${var.stage}"
    vpc_arn                 = "arn:aws:ec2:*:*:vpc/${data.aws_ssm_parameter.vpc_id.value}"
    codepipeline_bucket_arn = "${aws_s3_bucket.codepipeline_bucket.arn}"
  }
}

resource "aws_iam_role_policy" "codebuild_role_policy" {
  role   = "${aws_iam_role.codebuild_role.name}"
  name   = "${local.cicd_name_prefix}-codebuild-policy"
  policy = "${data.template_file.codebuild_role_policy_doc.rendered}"
}
