const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/leads");

const app = express();

app.use(helmet());

// ✅ ALLOW CORS BEFORE ROUTES
const allowedOrigins = [
  process.env.CLIENT_URL,          // Your production frontend
  "http://localhost:5173"          // Local dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked CORS request from: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,  // ✅ Important for cookies
  })
);

app.options("*", cors()); // ✅ Allow preflight for all routes

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// ✅ ROUTES
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

module.exports = app;
