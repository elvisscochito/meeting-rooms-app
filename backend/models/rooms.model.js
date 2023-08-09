import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: String
});

const roomsSchema = new mongoose.Schema({
  name: String,
  meetings: [meetingSchema]
});

const roomModel = mongoose.model("Room", roomsSchema);
const meetingModel = mongoose.model("Meeting", meetingSchema);

export { meetingModel, roomModel };
