# Budget Manager Backend

NestJS backend API for the Budget Manager application.

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)

## Setup

1. **Install dependencies:**
```bash
   npm install
```

2. **Set up MySQL database:**
   ```sql
   CREATE DATABASE budget_manager;
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=budget_manager
   PORT=3000
   ```

4. **Run the application:**
```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## Database Schema

The application uses TypeORM with MySQL. Tables are automatically created when `synchronize: true` is enabled (development only).

### Tables:
- `transactions` - Stores income and expense transactions
- `budgets` - Stores budget limits by category

## API Endpoints

See the main README.md for API documentation.
