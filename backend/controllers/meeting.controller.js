import { meetingModel, roomModel } from "../models/rooms.model.js";

export const getMeetings = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: req.params.room });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    /** @note get meetings and their room, both without __v field */

    const meetings = await meetingModel.find({ room: room._id }, { __v: 0 }).populate('room', { __v: 0 });

    res.status(200).json(meetings);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const postMeeting = async (req, res) => {
  try {
    const room = await roomModel.findOne({ name: req.params.room });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const newMeeting = await meetingModel.create({
      title: req.body.title,
      room: room._id
    });

    await newMeeting.save();

    res.status(201).json(newMeeting);
  }
  catch (error) {
    res.status(409).json({ message: error.message });
  }
}
