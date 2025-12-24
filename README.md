# Budget Manager

A full-stack budget management application built with Next.js (frontend) and NestJS (backend).

## Features

- ✅ Add, edit, and delete income/expense transactions
- ✅ Track spending by category
- ✅ Set monthly budget limits per category
- ✅ Visual spending overview with charts
- ✅ Real-time statistics (income, expenses, balance)
- ✅ Filter transactions by type, category, and month
- ✅ MySQL database for data persistence

## Tech Stack

### Frontend
- **Next.js 16** (React framework)
- **TypeScript**
- **Tailwind CSS** (styling)
- **Chart.js** (data visualization)
- **Axios** (HTTP client)

### Backend
- **NestJS** (Node.js framework)
- **TypeORM** (ORM)
- **MySQL** (database)
- **TypeScript**

## Project Structure

```
Website/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   └── lib/          # API client and utilities
├── backend/          # NestJS backend application
│   ├── src/
│   │   ├── entities/ # Database entities
│   │   ├── transactions/ # Transaction module
│   │   └── budgets/   # Budget module
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL Server (v8.0 or higher)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Website
   ```

2. **Set up MySQL database:**
   ```bash
   mysql -u root -p
   ```
   Then in MySQL:
   ```sql
   CREATE DATABASE budget_manager;
   EXIT;
   ```

3. **Configure backend environment:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=budget_manager
   PORT=3000
   ```

4. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

5. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers.

**Terminal 1 - Start the backend server:**
```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3000`

**Terminal 2 - Start the frontend server:**
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3001`

Open your browser and navigate to `http://localhost:3001` to use the application.

## API Endpoints

### Transactions
- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get transaction by ID
- `GET /transactions/stats` - Get statistics (income, expenses, balance)
- `POST /transactions` - Create a new transaction
- `PATCH /transactions/:id` - Update a transaction
- `DELETE /transactions/:id` - Delete a transaction

### Budgets
- `GET /budgets` - Get all budgets
- `GET /budgets/with-spending` - Get budgets with spending data
- `POST /budgets` - Create a new budget
- `PATCH /budgets/:id` - Update a budget
- `DELETE /budgets/:id` - Delete a budget

## Database

The application uses MySQL database. Make sure MySQL is running and the database `budget_manager` is created before starting the backend server. Tables are automatically created by TypeORM when you first run the application (in development mode with `synchronize: true`).

## Development

### Backend Development
```bash
cd backend
npm run start:dev  # Development mode with hot reload
npm run build      # Build for production
npm run start:prod # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev        # Development mode
npm run build      # Build for production
npm run start      # Run production build
```

## License

MIT

