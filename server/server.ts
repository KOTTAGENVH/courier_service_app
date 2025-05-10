// server.ts
import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRouter from "./router/authRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { seedAdmin } from "./controller/authController.js";
import shipmentRouter from "router/shipRouter.js";

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(limiter);
//Cors
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === "http://localhost:3000") {
        return callback(null, true);
      }
      return callback(
        new Error("Access denied: access is restricted"),
        false
      );
    },
  })
);

// Seed admin on startup
seedAdmin().catch(err => {
  console.error('Failed to seed admin:', err);
});

// Routes
app.use("/auth", authRouter);
app.use("/ship", shipmentRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
