module "vpc" {
    source = "terraform-aws-modules/vpc/aws"

    name = "${var.application_id}"
    cidr = "${var.vpc_cidr}"

    azs             = "${var.availability_zone_names}"
    private_subnets = "${var.private_subnets_cidr}"
    public_subnets  = "${var.public_subnets_cidr}"

    enable_nat_gateway = true
    single_nat_gateway  = true

    tags = local.common_tags
}