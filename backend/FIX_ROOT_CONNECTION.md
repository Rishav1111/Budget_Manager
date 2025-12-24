# Fix MySQL Root Connection Issues

## Problem: Can't connect with root username

If you're having issues connecting with `root` username, here are solutions:

## Solution 1: Create a Custom MySQL User (Recommended)

Instead of using root, create a dedicated user for the budget manager app.

### Step 1: Connect to MySQL (try different methods)

**Option A: Use MySQL Workbench with existing connection**
- If you have ANY working connection, use that

**Option B: Use Terminal**
```bash
mysql -u root -p
# Try with empty password if it doesn't work
mysql -u root
```

**Option C: Reset root password**
- If root password is lost, you may need to reset it

### Step 2: Create New User

Once connected, run these SQL commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS budget_manager;

-- Create new user (replace 'your_password' with a strong password)
CREATE USER 'budget_user'@'localhost' IDENTIFIED BY 'your_password';

-- Grant all privileges
GRANT ALL PRIVILEGES ON budget_manager.* TO 'budget_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify user was created
SELECT User, Host FROM mysql.user WHERE User = 'budget_user';

-- Exit
EXIT;
```

### Step 3: Update .env File

Edit `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=budget_user
DB_PASSWORD=your_password
DB_DATABASE=budget_manager
PORT=3000
```

### Step 4: Update MySQL Workbench Connection

Use these settings:
- **Username:** `budget_user`
- **Password:** `your_password` (the one you set above)
- **Default Schema:** `budget_manager`

## Solution 2: Fix Root Connection

### Try Empty Password

If root password was never set, try connecting with empty password:

**In MySQL Workbench:**
- Username: `root`
- Password: Leave empty (or click "Clear" if there's text)

**In .env file:**
```env
DB_USERNAME=root
DB_PASSWORD=
```

### Reset Root Password

If you forgot root password:

1. Stop MySQL server
2. Start MySQL in safe mode
3. Reset password
4. Restart MySQL server

**On Mac:**
```bash
# Stop MySQL
sudo /usr/local/mysql/support-files/mysql.server stop

# Start in safe mode (skip grant tables)
sudo /usr/local/mysql/bin/mysqld_safe --skip-grant-tables &

# Connect without password
mysql -u root

# Reset password
USE mysql;
UPDATE user SET authentication_string=PASSWORD('new_password') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;

# Restart MySQL normally
sudo /usr/local/mysql/support-files/mysql.server restart
```

## Solution 3: Use Existing MySQL User

If you have another MySQL user that works:

1. Use that username in `.env`
2. Make sure that user has access to `budget_manager` database:

```sql
GRANT ALL PRIVILEGES ON budget_manager.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

## Quick Test

After updating `.env`, test the connection:

```bash
cd backend
npm run start:dev
```

Look for:
- ✅ "Backend server running on http://localhost:3000"
- ❌ "Unable to connect to the database" → Check credentials again

## Recommended Approach

**Best practice:** Create a custom user instead of using root:

1. Easier to manage
2. More secure
3. Less likely to have permission issues
4. Can be deleted/recreated if needed

Use Solution 1 above to create `budget_user`.



