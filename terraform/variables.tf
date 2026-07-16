##############################################################################
# Input Variables
##############################################################################

variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (e.g., production, staging)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name prefix applied to all resource names"
  type        = string
  default     = "homeserve"
}

# ─── EC2 ──────────────────────────────────────────────────────────────────────

variable "ec2_instance_type" {
  description = "EC2 instance type for the application server"
  type        = string
  default     = "t3.micro"
}

variable "ec2_public_key" {
  description = "SSH public key content to install on EC2 (e.g., contents of ~/.ssh/id_ed25519.pub)"
  type        = string
  sensitive   = true
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance. Use your IP address (e.g., '1.2.3.4/32')"
  type        = string
  default     = "0.0.0.0/0"    # ⚠️ Restrict this to your IP in production!
}

# ─── RDS ──────────────────────────────────────────────────────────────────────

variable "db_name" {
  description = "Name of the PostgreSQL database to create"
  type        = string
  default     = "home_service_db"
}

variable "db_username" {
  description = "Master username for the RDS PostgreSQL instance"
  type        = string
  default     = "homeserve_admin"
  sensitive   = true
}

variable "db_password" {
  description = "Master password for the RDS PostgreSQL instance. Use AWS Secrets Manager in production."
  type        = string
  sensitive   = true
}
