output "codepipeline_name" {
  description = "Name of the CICD pipeline"
  value       = "${aws_codepipeline.pipeline.name}"
}

output "github_webhook" {
  description = "Url of the GitHub Webhook for the CICD pipeline"
  value       = "${github_repository_webhook.github_webhook.url}"
}