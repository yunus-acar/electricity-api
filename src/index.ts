import express from "express";
import cors from "cors";
import { config } from "dotenv";
import router from "./routes";

config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", router);

// Server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port 🚀 ${port}`);
});
