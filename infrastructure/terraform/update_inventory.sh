#!/bin/bash

# Get the EC2 instance IP from Terraform output
EC2_IP=$(terraform output -raw instance_public_ip)

# Update the Ansible inventory file with the EC2 IP
echo "[webservers]
$EC2_IP

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=../terraform/library-key
ansible_ssh_common_args='-o StrictHostKeyChecking=no'" > ../ansible/inventory.ini

echo "Updated inventory.ini with EC2 IP: $EC2_IP"
