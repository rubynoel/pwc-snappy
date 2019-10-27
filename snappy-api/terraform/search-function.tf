resource "aws_lambda_permission" "search_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.search_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_deployment.search_api_gateway_deployment.execution_arn}/GET/search/*/*"
}

resource "aws_lambda_function" "search_lambda" {
  filename         = "${path.module}/../search/dist/app.zip"
  function_name    = "${local.resource_name_prefix}-search-handler"
  role             = "${aws_iam_role.search_lambda_role.arn}"
  handler          = "index.handler"
  runtime          = "nodejs8.10"
  source_code_hash = "${filebase64sha256("${path.module}/../search/dist/app.zip")}"
  depends_on       = ["aws_iam_role_policy_attachment.search_lambda_role_policy_attachment"]

  vpc_config {
    subnet_ids = split(",", data.aws_ssm_parameter.param_private_subnet_ids.value)
    security_group_ids = [
      "${data.aws_ssm_parameter.default_security_group_id.value}" #TODO: Create a separate security group
    ]
  }

  environment {
    variables = {
      STAGE               = "${var.stage}"
      APPLICATION_ID      = "${var.application_id}"
      RESOURCE_REGION     = "${var.aws_region}"
      SSM_KEY_DB_HOST     = "${data.aws_ssm_parameter.rds_postgres_address.name}"
      SSM_KEY_DB_NAME     = "${data.aws_ssm_parameter.rds_postgres_database_name.name}"
      SSM_KEY_DB_PORT     = "${data.aws_ssm_parameter.rds_postgres_database_port.name}"
      SSM_KEY_DB_USER     = "${data.aws_ssm_parameter.rds_postgres_username.name}"
      SSM_KEY_DB_PASSWORD = "${data.aws_ssm_parameter.rds_postgres_password.name}"
    }
  }
}

resource "aws_iam_role" "search_lambda_role" {
  name               = "${local.resource_name_prefix}-search-lambda-role"
  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

resource "aws_iam_policy" "search_lambda_role_policy" {
  name        = "${local.resource_name_prefix}-search-lambda-role-policy"
  path        = "/"
  description = "IAM policy for search lambda"
  policy      = "${data.template_file.search_lambda_role_policy_doc.rendered}"
}

data "template_file" "search_lambda_role_policy_doc" {
  template = "${file("${path.module}/templates/search-lambda-role-policy.tpl")}"
  vars = {
    application_id = "${var.application_id}"
    stage          = "${var.stage}"
  }
}
resource "aws_iam_role_policy_attachment" "search_lambda_role_policy_attachment" {
  role       = "${aws_iam_role.search_lambda_role.name}"
  policy_arn = "${aws_iam_policy.search_lambda_role_policy.arn}"
}
