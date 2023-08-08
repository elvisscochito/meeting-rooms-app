import { meetingModel, roomModel } from "../models/rooms.model.js";

export const postMeeting = async (req, res) => {
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
};
