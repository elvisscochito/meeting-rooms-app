import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./db.js";
import datetimeRoutes from "./routes/datetime.js";
import meetingRoutes from "./routes/meeting.js";
import roomRoutes from "./routes/room.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
dotenv.config();
connectDB();

app.set("port", process.env.PORT || 3000);
const PORT = app.get("port");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/', roomRoutes);
app.use('/', meetingRoutes);
app.use('/', datetimeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
