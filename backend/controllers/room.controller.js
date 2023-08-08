import { roomModel } from "../models/rooms.model.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await roomModel.find().populate("meetings");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ error: "Error processing request", details: error.message });
  }
}

export const postRoom = async (req, res) => {
  try {
    const room = await roomModel.create({ name: req.body.name });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: "Error processing request", details: error.message });
  }
};
