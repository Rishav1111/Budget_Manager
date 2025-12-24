-- Initialization script for MySQL database
-- This runs automatically when the container is first created

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS budget_manager;

-- Grant privileges to rishav123 user
-- Note: User is created automatically by docker-compose environment variables
GRANT ALL PRIVILEGES ON budget_manager.* TO 'rishav123'@'%';
FLUSH PRIVILEGES;

-- Use the database
USE budget_manager;


