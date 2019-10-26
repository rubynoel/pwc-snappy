resource "aws_lambda_permission" "search_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.search_lambda.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_deployment.search_api_gateway_deployment.execution_arn}*/*/*"
}

resource "aws_lambda_function" "search_lambda" {
  filename         = "${path.module}/../search/dist/app.zip"
  function_name    = "${local.resource_name_prefix}-search-handler"
  role             = "${aws_iam_role.search_lambda_role.arn}"
  handler          = "index.handler"
  runtime          = "nodejs8.10"
  source_code_hash = "${filebase64sha256("${path.module}/../search/dist/app.zip")}"
  depends_on       = ["aws_iam_role_policy_attachment.search_lambda_role_policy_attachment"]
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
