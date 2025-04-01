variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment for the deployment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "aws_ami_id" {
  description = "The ID of the AMI to use for the EC2 instance (Ubuntu 20.04 LTS)"
  type        = string
  default     = "ami-0261755bbcb8c4a84" # Ubuntu 20.04 LTS in us-east-1
}

variable "instance_type" {
  description = "The type of EC2 instance to use"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "The name of the SSH key pair to use for EC2 instances"
  type        = string
  default     = "library-key-pair"
}

variable "private_key_path" {
  description = "Path to the private SSH key file"
  type        = string
  default     = "~/.ssh/library-key-pair.pem"
}

variable "tags" {
  description = "A map of tags to apply to resources"
  type        = map(string)
  default     = {
    Project     = "Library_Book_Management"
    Environment = "dev"
  }
}