# Alternatives to MySQL Workbench

## Problem
MySQL Workbench is crashing on your M2 Mac (Apple Silicon). This is a known compatibility issue.

## Solution: Use These Alternatives

### Option 1: Command Line (Easiest - Already Working!)

Since MySQL is running in Docker, you can use the command line:

```bash
# Connect to MySQL
docker exec -it budget_manager_mysql mysql -u rishav123 -prishav123 budget_manager

# Then run SQL commands:
SHOW TABLES;
SELECT * FROM transactions;
SELECT * FROM budgets;
EXIT;
```

### Option 2: TablePlus (Recommended GUI)

**Download:** https://tableplus.com/

**Connection Settings:**
- Name: Budget Manager
- Type: MySQL
- Host: localhost
- Port: 3306
- User: rishav123
- Password: rishav123
- Database: budget_manager

**Why TablePlus?**
- ✅ Native Apple Silicon support (no crashes!)
- ✅ Beautiful, modern interface
- ✅ Free for basic use
- ✅ Works perfectly with Docker MySQL

### Option 3: DBeaver (Free, Open Source)

**Download:** https://dbeaver.io/download/

**Connection Settings:**
- Database: MySQL
- Host: localhost
- Port: 3306
- Database: budget_manager
- Username: rishav123
- Password: rishav123

### Option 4: Sequel Pro / Sequel Ace (Mac Native)

**Download:** https://sequel-ace.com/

**Connection Settings:**
- Host: localhost
- Username: rishav123
- Password: rishav123
- Database: budget_manager

### Option 5: VS Code Extension

Install "MySQL" extension in VS Code:
1. Open VS Code
2. Go to Extensions
3. Search "MySQL"
4. Install "MySQL" by Jun Han
5. Connect using same credentials

## Quick Commands Reference

### View All Tables
```bash
docker exec -it budget_manager_mysql mysql -u rishav123 -prishav123 budget_manager -e "SHOW TABLES;"
```

### View All Transactions
```bash
docker exec -it budget_manager_mysql mysql -u rishav123 -prishav123 budget_manager -e "SELECT * FROM transactions;"
```

### View All Budgets
```bash
docker exec -it budget_manager_mysql mysql -u rishav123 -prishav123 budget_manager -e "SELECT * FROM budgets;"
```

### Interactive MySQL Shell
```bash
docker exec -it budget_manager_mysql mysql -u rishav123 -prishav123 budget_manager
```

## Recommended: TablePlus

For the best experience on Mac, I recommend **TablePlus**:
- Native Apple Silicon support
- No crashes
- Beautiful UI
- Easy to use
- Free version available

Your Docker MySQL is working perfectly - you just need a different GUI tool!


