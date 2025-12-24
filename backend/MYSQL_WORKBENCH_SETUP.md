# MySQL Workbench Configuration Guide

## Connection Configuration

Use these settings to connect to your MySQL database in MySQL Workbench:

### Connection Settings

**Connection Name:** `Budget Manager Local`

**Connection Method:** `Standard (TCP/IP)`

**Hostname:** `localhost` (or `127.0.0.1`)

**Port:** `3306`

**Username:** `root` (or your MySQL username)

**Password:** `[Click Store in Vault and enter your MySQL password]`

**Default Schema:** `budget_manager` (optional, but recommended)

## Step-by-Step Setup

### 1. Open MySQL Workbench

Launch MySQL Workbench on your Mac.

### 2. Create New Connection

1. Click the **"+"** icon next to "MySQL Connections" in the home screen
2. Or go to **Database → Manage Connections** and click **"New"**

### 3. Enter Connection Details

Fill in the following:

```
Connection Name: Budget Manager Local
Hostname: localhost
Port: 3306
Username: root
Password: [your MySQL password]
Default Schema: budget_manager
```

### 4. Test Connection

1. Click **"Test Connection"** button
2. Enter your MySQL password if prompted
3. You should see: **"Successfully made the MySQL connection"**

### 5. Save and Connect

1. Click **"OK"** to save the connection
2. Double-click the connection to connect
3. Enter your password when prompted

## Viewing Tables

Once connected:

### 1. View Database Schema

1. In the left sidebar, expand **"SCHEMAS"**
2. Expand **"budget_manager"**
3. Expand **"Tables"**
4. You'll see:
   - `transactions`
   - `budgets`

### 2. View Table Data

**Option A: Using the GUI**
1. Right-click on a table (e.g., `transactions`)
2. Select **"Select Rows - Limit 1000"**
3. The table data will appear in the result grid below

**Option B: Using SQL Query**
1. Click on the **"SQL"** tab (or press `Cmd + T`)
2. Type:
   ```sql
   USE budget_manager;
   SELECT * FROM transactions;
   SELECT * FROM budgets;
   ```
3. Click the **lightning bolt** icon (or press `Cmd + Enter`) to execute

### 3. View Table Structure

1. Right-click on a table
2. Select **"Table Inspector"**
3. Go to the **"Columns"** tab to see the structure

## Quick SQL Queries

Once connected, you can run these queries:

```sql
-- Switch to database
USE budget_manager;

-- View all transactions
SELECT * FROM transactions ORDER BY date DESC;

-- View all budgets
SELECT * FROM budgets;

-- View table structure
DESCRIBE transactions;
DESCRIBE budgets;

-- Count records
SELECT COUNT(*) as total_transactions FROM transactions;
SELECT COUNT(*) as total_budgets FROM budgets;

-- View expenses by category
SELECT category, SUM(amount) as total 
FROM transactions 
WHERE type = 'expense' 
GROUP BY category;
```

## Troubleshooting

### Connection Refused Error
- Make sure MySQL server is running:
  ```bash
  # Check if MySQL is running
  brew services list | grep mysql
  # Or start MySQL
  brew services start mysql
  ```

### Access Denied Error
- Verify your MySQL username and password
- Make sure the user has access to the `budget_manager` database

### Database Not Found
- Create the database first:
  ```sql
  CREATE DATABASE budget_manager;
  ```
- Or let the backend create it automatically when you start the server

## Default Configuration Values

If you're using the default `.env` settings:

```
Hostname: localhost
Port: 3306
Username: root
Password: [your MySQL root password]
Database: budget_manager
```

