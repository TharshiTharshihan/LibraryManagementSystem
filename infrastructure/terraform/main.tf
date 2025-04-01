# main.tf

# Specify the provider
provider "aws" {
  region = var.aws_region
}

# Create a VPC
resource "aws_vpc" "library_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "library-vpc"
  }
}

# Create a public subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.library_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags = {
    Name = "library-public-subnet"
  }
}

# Create an internet gateway
resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.library_vpc.id
  tags = {
    Name = "library-igw"
  }
}

# Create a route table
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.library_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
  tags = {
    Name = "library-public-rt"
  }
}

# Associate the route table with the subnet
resource "aws_route_table_association" "public_rta" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

# Create a security group for EC2
resource "aws_security_group" "library_sg" {
  name        = "library-sg"
  description = "Allow SSH, HTTP, and application ports"
  vpc_id      = aws_vpc.library_vpc.id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend application port
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend application port
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # MongoDB port
  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # Outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "library-sg"
  }
}

# Create a key pair for EC2 instances
resource "aws_key_pair" "library_key_pair" {
  key_name   = var.key_name
  public_key = file("${path.module}/library-key.pub")
}

# Create an EC2 instance
resource "aws_instance" "library_instance" {
  ami                    = var.aws_ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.library_key_pair.key_name
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.library_sg.id]

  tags = {
    Name = "library-ec2-instance"
  }

  # Create inventory file for Ansible
  provisioner "local-exec" {
    command = "echo '[webservers]\n${self.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=${var.private_key_path}' > ../ansible/inventory.ini"
  }
}

# Output the EC2 instance public IP
output "ec2_public_ip" {
  value = aws_instance.library_instance.public_ip
}

# Define an S3 bucket
resource "aws_s3_bucket" "library_bucket" {
    bucket = "library-book-management-bucket"
    acl    = "private"

    tags = {
        Name        = "LibraryBookManagement"
        Environment = "Dev"
    }
}

# Define a DynamoDB table
resource "aws_dynamodb_table" "library_table" {
    name           = "LibraryBooks"
    billing_mode   = "PAY_PER_REQUEST"
    hash_key       = "BookID"

    attribute {
        name = "BookID"
        type = "S"
    }

    tags = {
        Name        = "LibraryBooksTable"
        Environment = "Dev"
    }
}

# Output the S3 bucket name
output "s3_bucket_name" {
    value = aws_s3_bucket.library_bucket.bucket
}

# Output the DynamoDB table name
output "dynamodb_table_name" {
    value = aws_dynamodb_table.library_table.name
}