resource "aws_s3_bucket" "snappy_ui" {
  bucket = "s3-website-${local.resource_name_prefix}"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}
