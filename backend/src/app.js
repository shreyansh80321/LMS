const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/leads");

const app = express();

app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL, 
  "http://localhost:5173", 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Blocked CORS request from: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

module.exports = app;
