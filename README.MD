# Project Name

This repository contains a full-stack scheduling application with separate **frontend** and **backend** projects.

## Project Structure

```
root/
├── backend/      # Node.js/Express backend
├── frontend/     # React frontend
├── README.md
```

---

## Backend

The backend is built with **Node.js**, **Express**, and uses a database to store schedule slots.

### Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:4000`.

### Available Endpoints

- `GET /slots?start=YYYY-MM-DD` – Get slots for a week starting from a given date
- `POST /slots` – Create a new slot
- `PUT /slots/:id` – Update a slot
- `DELETE /slots/:id` – Delete a slot

---

## Frontend

The frontend is built with **React** and TypeScript.

### Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000`.

### Features

- Weekly calendar view
- Add, edit, and delete schedule slots
- Slots limited to 2 per day
- Today’s date highlighted
- Infinite scroll to navigate weeks
- Responsive design with circular + button for creating slots

---

## Notes

- Make sure both backend and frontend servers are running simultaneously.
- API base URL in frontend: `http://localhost:4000/slots` (adjust if backend port changes)
- `.env` files should be configured in both frontend and backend as needed.

