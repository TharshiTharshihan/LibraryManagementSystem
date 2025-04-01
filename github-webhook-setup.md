# GitHub Webhook Configuration for Jenkins

This guide explains how to set up a GitHub webhook to automatically trigger your Jenkins pipeline when you push to the main branch.

## Prerequisites
- Admin access to your GitHub repository
- Jenkins server with the GitHub Integration plugin installed

## Steps to Configure GitHub Webhook

### 1. Get Jenkins Webhook URL
- Go to your Jenkins dashboard
- Navigate to "Manage Jenkins" > "Configure System"
- Scroll down to the GitHub section
- Note your Jenkins URL (usually http://your-jenkins-server:8080/github-webhook/)

### 2. Add Webhook in GitHub
- Go to your GitHub repository: https://github.com/TharshiTharshihan/LibraryManagementSystem
- Click on "Settings" in the top navigation
- Select "Webhooks" from the left sidebar
- Click "Add webhook"
- Set Payload URL to your Jenkins webhook URL
- Content type: Select "application/json"
- Secret: (Optional) You can configure a secret token
- Which events to trigger: Select "Just the push event"
- Ensure "Active" is checked
- Click "Add webhook"

### 3. Test the Webhook
- Make a small change to your repository
- Push the change to the main branch
- Go to your Jenkins dashboard to verify that a new build was triggered automatically

## Troubleshooting
- Check Jenkins logs for any webhook reception issues
- Ensure your Jenkins server is accessible from GitHub's servers
- Verify that the GitHub plugin is correctly configured in Jenkins
