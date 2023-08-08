import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: String
});

const roomsSchema = new mongoose.Schema({
  name: String,
  meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }]
});

const roomModel = mongoose.model("Room", roomsSchema);
const meetingModel = mongoose.model("Meeting", meetingSchema);

export { meetingModel, roomModel };
