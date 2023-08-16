import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 100
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  host: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  }
});

const meetingModel = mongoose.model("Meeting", meetingSchema);

export default meetingModel;
