# VPC
output "vpc_id" {
  description = "The ID of the VPC"
  value       = "${module.vpc.vpc_id}"
}

# CIDR blocks
output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = ["${module.vpc.vpc_cidr_block}"]
}

# Subnets
output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = ["${module.vpc.private_subnets}"]
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = ["${module.vpc.public_subnets}"]
}

# NAT gateways
output "nat_public_ips" {
  description = "List of public Elastic IPs created for AWS NAT Gateway"
  value       = ["${module.vpc.nat_public_ips}"]
}

# AZs
output "azs" {
  description = "A list of availability zones spefified as argument to this module"
  value       = ["${module.vpc.azs}"]
}

output "ssm_automation_build_cicd_node_ami_doc_name" {
  description = "Name of automation document used to create/update cicd node ami"
  value       = ["${aws_ssm_document.ssm_automation_create_cicd_node_ami_doc.name}"]
}

output "ssm_managed_instance_profile_name" {
  description = "SSM Managed Instance Name"
  value       = ["${aws_iam_instance_profile.ssm_managed_instance_profile.name}"]
}

output "ssm_automation_service_role_arn" {
  description = "The ARN of the role that allows Automation to perform the actions on your behalf"
  value       = ["${aws_iam_role.ssm_automation_service_role.arn}"]
}