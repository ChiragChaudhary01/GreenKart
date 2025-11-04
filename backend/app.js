import express from "express";
import { authRouter } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { adminRouter } from "./routes/adminRoutes.js";
import { consumerRouter } from "./routes/consumerRoutes.js";
import { farmerRouter } from "./routes/farmerRoutes.js";
import { deliveryRouter } from "./routes/deliveryRoutes.js";
import cors from "cors";

const app = express();

// ✅ Allow frontend origin
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies if needed
  })
);

// parse JSON
app.use(express.json());

app.use(cookieParser());

app.use(express.json()); // parse JSON body
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use(consumerRouter);
app.use("/farmer", farmerRouter);
app.use("/delivery", deliveryRouter);

export default app;
