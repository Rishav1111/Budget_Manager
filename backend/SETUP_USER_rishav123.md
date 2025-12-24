# Setup MySQL User: rishav123

## Your Current Configuration

Your `.env` file is set to:
```
Username: rishav123
Password: rishav123
Database: budget_manager
```

## Step 1: Create the User in MySQL

Connect to MySQL (using any method that works) and run:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS budget_manager;

-- Create user (if it doesn't exist)
CREATE USER IF NOT EXISTS 'rishav123'@'localhost' IDENTIFIED BY 'rishav123';

-- Grant privileges
GRANT ALL PRIVILEGES ON budget_manager.* TO 'rishav123'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SELECT User, Host FROM mysql.user WHERE User = 'rishav123';
```

## Step 2: MySQL Workbench Configuration

Use these exact settings in MySQL Workbench:

```
Connection Name: Budget Manager
Hostname:        localhost
Port:            3306
Username:        rishav123
Password:        rishav123
Default Schema:  budget_manager
```

## Step 3: Test Connection

1. Click "Test Connection"
2. Enter password: `rishav123`
3. Should see: "Successfully made the MySQL connection"

## Step 4: Verify Backend Connection

Restart your backend:
```bash
cd backend
npm run start:dev
```

You should see:
```
[Nest] Backend server running on http://localhost:3000
```

If you see connection errors, the user might not exist yet - run Step 1 above.



