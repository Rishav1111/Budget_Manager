# MySQL Workbench Setup - Step by Step

## Step 1: Open MySQL Workbench

1. Open MySQL Workbench application
2. You should see the home screen with "MySQL Connections"

## Step 2: Create New Connection

**Option A: Click the "+" button**
- Look for a "+" icon next to "MySQL Connections" 
- Click it to create a new connection

**Option B: Use Menu**
- Go to **Database → Manage Connections**
- Click **"New"** button at the bottom

## Step 3: Fill in Connection Details

In the "Setup New Connection" dialog:

### Connection Name:
```
Budget Manager Local
```
(You can use any name you want)

### Connection Method:
- Should already be set to **"Standard (TCP/IP)"**
- Leave it as is

### Parameters Tab (should be selected by default):

**Hostname:**
- Type: `localhost`
- OR use: `127.0.0.1`
- (Both are the same)

**Port:**
- Type: `3306`
- (This is the default MySQL port)

**Username:**
- Type: `root`
- (Or your MySQL username if you created a custom user)

**Password:**
- Click the button **"Store in Keychain ..."** (or "Store in Vault")
- Enter your MySQL root password
- Click OK

**Default Schema:**
- Type: `budget_manager`
- (This is optional but recommended)

## Step 4: Test Connection

1. Click the **"Test Connection"** button at the bottom
2. Enter your MySQL password if prompted
3. You should see: **"Successfully made the MySQL connection"**
4. If you see an error, see Troubleshooting below

## Step 5: Save Connection

1. Click **"OK"** to save the connection
2. You should now see your connection in the list

## Step 6: Connect

1. Double-click on your connection name
2. Enter password if prompted
3. You should now be connected!

## Troubleshooting

### Error: "Cannot Connect to Database Server"

**Solution 1: Start MySQL Server**
- MySQL server might not be running
- On Mac: Go to **System Preferences → MySQL → Start MySQL Server**
- Or open MySQL Workbench and try to connect - it might start automatically

**Solution 2: Check if MySQL is installed**
```bash
# In Terminal, check if MySQL is installed
which mysql
# Or
brew services list | grep mysql
```

**Solution 3: Install MySQL if missing**
```bash
brew install mysql
brew services start mysql
```

### Error: "Access Denied for user 'root'@'localhost'"

**Solution:**
- Your password might be wrong
- Try connecting with empty password (if you never set one)
- Or reset your MySQL root password

### Error: "Unknown database 'budget_manager'"

**Solution:**
1. Connect to MySQL first (without specifying database)
2. Run this SQL command:
```sql
CREATE DATABASE budget_manager;
```
3. Then reconnect with `budget_manager` as default schema

### Can't find the "+" button?

**Alternative method:**
1. Go to menu: **Database → Manage Connections**
2. Click **"New"** button
3. Fill in the same details

### Connection saves but won't connect?

1. Make sure MySQL server is actually running
2. Check if port 3306 is being used:
   ```bash
   lsof -i:3306
   ```
3. Try connecting without specifying a default schema first

## Quick Reference

```
Connection Name: Budget Manager Local
Hostname:        localhost (or 127.0.0.1)
Port:            3306
Username:        root
Password:        [Your MySQL password]
Default Schema:  budget_manager
```

## After Connecting

Once connected, you can:
1. See "SCHEMAS" in the left sidebar
2. Expand "budget_manager" (if it exists)
3. See tables: `transactions` and `budgets`
4. Right-click table → "Select Rows" to view data



