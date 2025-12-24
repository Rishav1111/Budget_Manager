# MySQL Database Guide

## Connecting to MySQL

### Option 1: MySQL Command Line Client
```bash
mysql -u root -p
```
Enter your MySQL password when prompted.

### Option 2: MySQL Workbench (GUI)
- Download MySQL Workbench from https://dev.mysql.com/downloads/workbench/
- Connect using your MySQL credentials

## Viewing the Database

Once connected to MySQL, use these commands:

### 1. Show all databases
```sql
SHOW DATABASES;
```

### 2. Use the budget_manager database
```sql
USE budget_manager;
```

### 3. Show all tables in the database
```sql
SHOW TABLES;
```

### 4. View table structure
```sql
-- View transactions table structure
DESCRIBE transactions;

-- View budgets table structure
DESCRIBE budgets;
```

### 5. View all data in tables
```sql
-- View all transactions
SELECT * FROM transactions;

-- View all budgets
SELECT * FROM budgets;
```

### 6. View transactions with formatted output
```sql
-- View transactions ordered by date (newest first)
SELECT * FROM transactions ORDER BY date DESC;

-- View only income transactions
SELECT * FROM transactions WHERE type = 'income';

-- View only expense transactions
SELECT * FROM transactions WHERE type = 'expense';

-- View transactions for a specific month
SELECT * FROM transactions WHERE date LIKE '2024-01%';
```

### 7. View statistics
```sql
-- Total income
SELECT SUM(amount) as total_income FROM transactions WHERE type = 'income';

-- Total expenses
SELECT SUM(amount) as total_expenses FROM transactions WHERE type = 'expense';

-- Balance
SELECT 
  (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'income') - 
  (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense') 
  AS balance;

-- Expenses by category
SELECT category, SUM(amount) as total 
FROM transactions 
WHERE type = 'expense' 
GROUP BY category;
```

### 8. View budgets with spending
```sql
SELECT 
  b.id,
  b.category,
  b.limit,
  COALESCE(SUM(t.amount), 0) as spent,
  (COALESCE(SUM(t.amount), 0) / b.limit * 100) as percentage
FROM budgets b
LEFT JOIN transactions t ON t.category = b.category AND t.type = 'expense' 
  AND t.date >= DATE_FORMAT(NOW(), '%Y-%m-01')
GROUP BY b.id, b.category, b.limit;
```

## Useful MySQL Commands

```sql
-- Count total transactions
SELECT COUNT(*) FROM transactions;

-- Count transactions by type
SELECT type, COUNT(*) as count FROM transactions GROUP BY type;

-- View latest 10 transactions
SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 10;

-- View transactions in a date range
SELECT * FROM transactions 
WHERE date BETWEEN '2024-01-01' AND '2024-01-31';

-- Exit MySQL
EXIT;
```

