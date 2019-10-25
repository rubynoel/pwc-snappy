resource "aws_iam_role" "cloudwatch_events_batch_schedule_role" {
  name = "${local.batch_name_prefix}-cloudwatch-events-role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
     {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "events.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
    ]
}
EOF
}

#TODO: restrict the permissions to only this batch using application_id and stage vars
data "template_file" "cloudwatch_events_batch_schedule_role_policy_doc" {
  template = "${file("${path.module}/templates/cloudwatch-batch-schedule-role-policy.tpl")}"

  vars = {
    application_id = "${var.application_id}"
    stage          = "${var.stage}"
  }
}

resource "aws_iam_role_policy" "cloudwatch_events_batch_schedule_role_policy" {
  role   = "${aws_iam_role.cloudwatch_events_batch_schedule_role.name}"
  name   = "${local.batch_name_prefix}-cloudwatch-batch-schedule-role-policy"
  policy = "${data.template_file.cloudwatch_events_batch_schedule_role_policy_doc.rendered}"
}

resource "aws_cloudwatch_event_rule" "cloudwatch_schedule_batch_event_rule" {
  name                = "${local.batch_name_prefix}-run-every-ten-mins"
  description         = "Schedule ${var.batch_name}"
  schedule_expression = "rate(10 minutes)"
  role_arn            = "${aws_iam_role.cloudwatch_events_batch_schedule_role.arn}"
}

resource "aws_cloudwatch_event_target" "cloudwatch_schedule_batch_event_target" {
  target_id = "${local.batch_name_prefix}-scheduled-run"
  rule      = "${aws_cloudwatch_event_rule.cloudwatch_schedule_batch_event_rule.name}"
  arn       = "${aws_batch_job_queue.batch_job_queue.arn}"
  role_arn  = "${aws_iam_role.cloudwatch_events_batch_schedule_role.arn}"
  batch_target {
    job_definition = "${aws_batch_job_definition.batch_job_definition.arn}"
    job_name       = "${local.batch_name_prefix}-scheduled-run"
  }
}