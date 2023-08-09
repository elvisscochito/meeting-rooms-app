import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String
})

const meetingSchema = new mongoose.Schema({
  title: String,
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  }
});

const roomModel = mongoose.model("Room", roomSchema);
const meetingModel = mongoose.model("Meeting", meetingSchema);

export { meetingModel, roomModel };
