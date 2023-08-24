import { roomModel } from "../models/models.js";

export const getRooms = async (req, res) => {
  try {

    /** @note get rooms without __v field */
    const rooms = await roomModel.find({}, { __v: 0 });
    res.status(200).json(rooms);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const postRoom = async (req, res) => {
  try {
    const newRoom = await roomModel.create({ name: req.body.name });
    await newRoom.save();
    res.status(201).json(newRoom);
  }
  catch (error) {
    res.status(409).json({ message: error.message });
  }
}
