// src/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Add this import
import db from "./db";
import slotsRouter from "./routes/slots";

dotenv.config();
const app = express();

// Add CORS middleware
app.use(cors({
  origin: "*", // Your frontend URL
  credentials: true
}));

app.use(express.json());
app.use("/slots", slotsRouter);

app.get('/', async (req, res) => {
    const result = await db.raw('SELECT NOW()');
    res.json({
      status: "Database connected",
      now: result.rows[0].now
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});