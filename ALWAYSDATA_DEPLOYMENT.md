# Deploying to alwaysdata.com

This guide provides step-by-step instructions for deploying your Personal Website Generator on alwaysdata.com.

## Prerequisites

- An alwaysdata.com account (free or paid plan)
- Your project code (either from Git or as a ZIP file)

## Deployment Steps

### 1. Create Your Site on alwaysdata.com

1. Log in to your alwaysdata.com dashboard
2. Go to "Web > Sites" and click "Add a site"
3. Enter a site name (e.g., personal-website)
4. Select "Node.js" as the type
5. Click "Add"

### 2. Upload Your Code

#### Option A: Using the File Manager

1. Go to "Files" in your alwaysdata.com dashboard
2. Navigate to `/www/your-site-name/` (replace "your-site-name" with your actual site name)
3. Upload your project files using the dashboard's file manager

#### Option B: Using SFTP

1. Connect to your alwaysdata.com account via SFTP:
   - Host: sftp-your-username.alwaysdata.net
   - Username: your-username
   - Password: your-password (or SSH key)
2. Navigate to `/www/your-site-name/`
3. Upload your project files

#### Option C: Using Git

1. Connect to your alwaysdata.com account via SSH:
   ```
   ssh your-username@ssh-your-username.alwaysdata.net
   ```
2. Navigate to your site directory:
   ```
   cd www/your-site-name/
   ```
3. Clone your repository:
   ```
   git clone https://github.com/your-username/your-repo.git .
   ```

### 3. Install Dependencies and Build

1. Connect to your alwaysdata.com account via SSH
2. Navigate to your site directory:
   ```
   cd www/your-site-name/
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the project:
   ```
   npm run build
   ```

### 4. Configure Your Site

1. Go to "Web > Sites" in your alwaysdata.com dashboard
2. Click on your site
3. In the "Configuration" tab, set:
   - Command: `node dist/index.js`
   - Working directory: `/your-username/www/your-site-name`
   - Environment variables:
     - KEY: NODE_ENV, VALUE: production

### 5. Ensure Data Directory Exists

Make sure the data directory is created and has the proper permissions:

```bash
mkdir -p data
chmod 755 data
```

### 6. Start Your Application

1. Restart your site from the alwaysdata.com dashboard
2. Your application should now be accessible at: `your-site-name.alwaysdata.net`

## Troubleshooting

If you encounter issues:

1. Check the logs in your alwaysdata.com dashboard under "Logs"
2. Verify the PORT and host are being set correctly in server/index.ts
3. Make sure all environment variables are correctly configured
4. Ensure the data directory exists and is writable

## Updating Your Site

To update your site after making changes:

1. If using Git, pull the latest changes:
   ```
   git pull
   ```
2. Rebuild the application:
   ```
   npm run build
   ```
3. Restart your site from the alwaysdata.com dashboard