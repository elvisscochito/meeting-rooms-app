import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./db.js";
import { meetingModel, roomModel } from "./models/rooms.model.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
dotenv.config();
connectDB();

app.set("port", process.env.PORT || 3000);
const PORT = app.get("port");

app.post("/room", async (req, res) => {
  try {
    const room = await roomModel.create({ name: req.body.name });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: "Error processing request", details: error.message });
  }
});

app.get("/room", async (req, res) => {
  try {
    const rooms = await roomModel.find().populate("meetings");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ error: "Error processing request", details: error.message });
  }
});

app.post("/meeting", async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: 'P101' });

    if (!room) {
      res.status(404).json({ error: "Room not found" });
    }

    const meeting = await meetingModel.create({ title: req.body.title });

    await meeting.save();

    room.meetings.push(meeting);
    await room.save();

    res.status(201).json(room);

  } catch (error) {
    res.status(400).json({ error: "Error processing request", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
