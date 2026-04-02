const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const qcRoutes = require("./routes/qcRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "qualitrack-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/qc", qcRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`QualiTrack API listening on port ${PORT}`);
});
