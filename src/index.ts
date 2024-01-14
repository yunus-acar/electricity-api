import express from "express";
import cors from "cors";
import { config } from "dotenv";
import router from "./routes";
import prisma from "./utils/prisma";

config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", router);
app.get("/health", async (req, res) => {
  try {
    await prisma.$disconnect();
    await prisma.$connect();
    res.status(200).json({ message: "Server is running 🚀" });
  } catch (err) {
    res.status(500).json({ message: "Server is not running" });
  }
});

// Server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port 🚀 ${port}`);
});
