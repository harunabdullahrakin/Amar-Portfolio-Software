# Hosting Guide: GitHub and alwaysdata.com

This guide provides step-by-step instructions for hosting your Personal Website Generator on GitHub and deploying it on alwaysdata.com.

## Table of Contents
1. [GitHub Setup](#github-setup)
2. [alwaysdata.com Setup](#alwaysdatacom-setup)
3. [Deploying Your Application](#deploying-your-application)
4. [Configuring Your Domain](#configuring-your-domain)
5. [Troubleshooting](#troubleshooting)

## GitHub Setup

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account (or create one if you don't have it).
2. Click on the "+" icon in the top-right corner and select "New repository".
3. Name your repository (e.g., "personal-website-generator").
4. Choose whether to make it public or private.
5. Skip the initialization options (no README, .gitignore, or license yet).
6. Click "Create repository".

### 2. Initialize Your Local Repository

From your project directory (where your code is), run the following commands:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/harunabdullahrakin/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your GitHub username and repository name.

### 3. Optional: Create a .gitignore File

Create a `.gitignore` file in your project root with the following contents:



# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# Cache directories
.npm/
.eslintcache
.stylelintcache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Misc
.DS_Store
Thumbs.db
```

## alwaysdata.com Setup

### 1. Create an Account

1. Go to [alwaysdata.com](https://www.alwaysdata.com/) and sign up for an account.
2. Choose a free plan or select a paid plan based on your needs.
3. Follow the registration process to create your account.

### 2. Create a Site

1. After logging in, navigate to the dashboard.
2. Go to "Web > Sites" and click "Add a site".
3. Choose a name for your site. This will determine your default subdomain: `your-site-name.alwaysdata.net`.
4. For the configuration, select "Node.js" as the type.

### 3. Set Up SSH Access (Optional but Recommended)

1. Go to "Remote access > SSH" in your dashboard.
2. Add your SSH key if you have one, or create a new one.
3. This will allow you to securely access your server via SSH.

## Deploying Your Application

### 1. Clone Your Repository on alwaysdata

1. Connect to your alwaysdata account via SSH:
   ```bash
   ssh YOUR_USERNAME@ssh-YOUR_USERNAME.alwaysdata.net
   ```

2. Navigate to your website directory:
   ```bash
   cd www/YOUR_SITE_NAME
   ```

3. Clone your GitHub repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git .
   ```
   (The dot at the end is important - it means "clone into the current directory")

### 2. Install Dependencies and Set Up Database

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   - Go to the alwaysdata dashboard, navigate to "Databases".
   - Create a new SQLite database.
   
3. Configure environment variables:
   - Create a `.env` file in your project root.
   - Add necessary environment variables.

### 3. Configure Node.js Application

1. In your alwaysdata dashboard, go to "Web > Sites".
2. Click on your site and update the configuration:
   - Command: `npm start` (Make sure you have a start script in your package.json)
   - Working directory: `/YOUR_USERNAME/www/YOUR_SITE_NAME`
   - Environment variables: Add any required environment variables here.

3. Update your application to use the correct port:
   Open `server/index.ts` and ensure the PORT is using environment variables:
   ```typescript
   const PORT = process.env.PORT || 8080;
   ```

4. Create a production build script in package.json if needed:
   ```json
   "scripts": {
     "start": "node dist/server/index.js",
     "build": "vite build && tsc -p tsconfig.server.json",
     "dev": "NODE_ENV=development tsx server/index.ts"
   }
   ```

### 4. Build and Start Your Application

1. Build your application for production:
   ```bash
   npm run build
   ```

2. Your site should now be running at `YOUR_SITE_NAME.alwaysdata.net`.

## Configuring Your Domain

### 1. Use a Custom Domain (Optional)

1. Register a domain name with a domain registrar of your choice.
2. In your alwaysdata dashboard, go to "Domains".
3. Click "Add a domain" and enter your domain name.
4. Follow the instructions to configure DNS settings at your domain registrar.
5. Set up DNS records to point to alwaysdata servers:
   - Type: A, Name: @, Value: (IP provided by alwaysdata)
   - Type: CNAME, Name: www, Value: YOUR_SITE_NAME.alwaysdata.net

### 2. Update Your Site Configuration

1. Go back to "Web > Sites" in your dashboard.
2. Update your site to use your custom domain.

## Troubleshooting

### Common Issues and Solutions

1. **Application not starting**:
   - Check logs in the alwaysdata dashboard under "Logs".
   - Make sure all dependencies are installed.
   - Verify that your start script is correct in package.json.

2. **Database connection issues**:
   - Check database credentials and connection strings.
   - Make sure SQLite file permissions are set correctly.

3. **404 errors or missing assets**:
   - Verify your static file serving configuration.
   - Check file paths and ensure they're correct for the production environment.

4. **Node.js version compatibility**:
   - In alwaysdata dashboard, go to "Environment > Node.js" to select the appropriate Node.js version.

### Getting Help

- Check alwaysdata documentation at [https://help.alwaysdata.com/](https://help.alwaysdata.com/).
- For GitHub issues, refer to [GitHub Docs](https://docs.github.com/en).
- For specific application issues, please refer to the application documentation.

## Updating Your Application

When you make changes to your code and want to update your deployed application:

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Your update description"
   git push
   ```

2. SSH into your alwaysdata account:
   ```bash
   ssh YOUR_USERNAME@ssh-YOUR_USERNAME.alwaysdata.net
   ```

3. Navigate to your site directory and pull changes:
   ```bash
   cd www/YOUR_SITE_NAME
   git pull
   ```

4. Install any new dependencies and rebuild:
   ```bash
   npm install
   npm run build
   ```

5. Restart your application from the alwaysdata dashboard if necessary.