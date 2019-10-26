resource "aws_api_gateway_rest_api" "search_api_gateway" {
  name        = "${local.resource_name_prefix}-search-api"
  description = "API to search company database"
  body        = "${data.template_file.search_api_swagger.rendered}"
  lifecycle {
    create_before_destroy = true
  }
}

data "template_file" search_api_swagger {
  template = "${file("../search/swagger.yml")}"

  vars = {
    search_lambda_arn = "${aws_lambda_function.search_lambda.invoke_arn}"
  }
}

resource "aws_api_gateway_deployment" "search_api_gateway_deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.search_api_gateway.id}"
  stage_name  = "${var.stage}"
}

