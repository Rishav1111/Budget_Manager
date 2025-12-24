# Push to GitHub - Step by Step

## Option 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `budget-manager` (or any name you like)
3. Description: "Full-stack budget management app with Next.js and NestJS"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Option 2: Use Existing Repository

If you already have a GitHub repository, use that URL.

## Commands to Run

After creating the repository, run these commands:

```bash
cd /Users/rishavshrestha/Desktop/Website

# Add all files
git add .

# Commit
git commit -m "Initial commit: Budget Manager with user authentication"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Quick Commands (Copy & Paste)

```bash
cd /Users/rishavshrestha/Desktop/Website
git add .
git commit -m "Initial commit: Budget Manager app"
# Then add your GitHub repo URL and push
```

