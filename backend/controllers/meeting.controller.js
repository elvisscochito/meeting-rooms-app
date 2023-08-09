import { meetingModel, roomModel } from "../models/rooms.model.js";

/* get meetings by room */
export const getMeetings = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: 'P102' }).populate("meetings");

    if (!room) {
      res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(room.meetings);

  } catch (error) {
    res.status(400).json({ error: "Error processing request", details: error.message });
  }
};

export const postMeeting = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: 'P102' });

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
};
