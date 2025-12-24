-- SQL Script to create user rishav123 and database
-- Run this in MySQL Workbench or MySQL command line

-- Create database
CREATE DATABASE IF NOT EXISTS budget_manager;

-- Create user (if using MySQL 8.0+)
CREATE USER IF NOT EXISTS 'rishav123'@'localhost' IDENTIFIED BY 'rishav123';

-- For older MySQL versions, use this instead:
-- CREATE USER 'rishav123'@'localhost' IDENTIFIED BY 'rishav123';

-- Grant all privileges on budget_manager database
GRANT ALL PRIVILEGES ON budget_manager.* TO 'rishav123'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Verify the user was created
SELECT User, Host FROM mysql.user WHERE User = 'rishav123';

-- Show databases
SHOW DATABASES;



