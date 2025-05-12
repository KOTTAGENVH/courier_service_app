// server.ts
import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRouter from "./router/authRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { seedAdmin } from "./controller/authController.js";
import shipmentRouter from "./router/shipRouter.js";
import "reflect-metadata";
import notificationRouter from "./router/notificationRouter.js";

dotenv.config();


const app: Application = express();
const PORT = process.env.PORT || 4000;
const allowed = [
  "http://localhost:3000",
];

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
//Cors
app.use(
  cors({
    origin: (origin, callback) => {
     if (!origin || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error("Access denied: access is restricted"),
        false
      );
    },
      credentials: true    
  })
);

// Seed admin on startup
seedAdmin().catch(err => {
  console.error('Failed to seed admin:', err);
});

// Routes
app.use("/auth", authRouter);
app.use("/ship", shipmentRouter);
app.use("/alert", notificationRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
