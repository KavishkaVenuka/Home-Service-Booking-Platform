##############################################################################
# Outputs — Values printed after `terraform apply`
##############################################################################

output "ec2_public_ip" {
  description = "Elastic IP address of the application server"
  value       = aws_eip.app_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.main.id
}

output "ssh_command" {
  description = "Example SSH command to connect to the EC2 instance"
  value       = "ssh -i ~/.ssh/your-key.pem ec2-user@${aws_eip.app_server.public_ip}"
}
