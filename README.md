# Item Management System

This is a full-stack application for managing items with CRUD operations. It consists of a React frontend and a FastAPI backend.

## Project Structure
- `frontend/`: React frontend application
- `backend/`: FastAPI backend application

## Setup and Running

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install fastapi uvicorn python-multipart sqlalchemy
```

3. Run the backend server:
```bash
uvicorn main:app --reload
```
The backend will be running at http://localhost:8000

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend development server:
```bash
npm start
```
The frontend will be running at http://localhost:3000

## Features
- Create new items with name, description, and price
- View all items in a table format
- Update existing items
- Delete items
- Modern and responsive UI using Material-UI
- RESTful API backend with FastAPI
- SQLite database for data persistence
