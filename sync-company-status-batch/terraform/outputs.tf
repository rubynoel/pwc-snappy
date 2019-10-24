output "rds_postgres_endpoint" {
  description = "RDS endpoint"
  value       = "${module.rds_postgres.this_db_instance_endpoint}"
}

output "rds_postgres_endpoint_instance_name" {
  description = "RDS database name"
  value       = "${module.rds_postgres.this_db_instance_name}"
}

output "rds_postgres_endpoint_instance_status" {
  description = "The status of the RDS instance"
  value       = "${module.rds_postgres.this_db_instance_status}"
}

