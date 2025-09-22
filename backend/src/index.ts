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
  origin: ["http://localhost:3000","https://schedulerfrontend-eb2iwiz9u-sourav-das-projects-f786ba5c.vercel.app"], // Your frontend URL
  credentials: true
}));

app.use(express.json());
app.use("/slots", slotsRouter);

app.get('/', async (req, res) => {
    const result = await db.raw('SELECT NOW()');
    res.send(`Database connected: ${result.rows[0].now}`);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});