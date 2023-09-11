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
  participants: {
    type: String,
    trim: true,
    maxlength: 25,
  },
  /* participants: [
    {
      type: String,
      trim: true,
      maxlength: 25,
    }
  ], */
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  /* participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ], */
  /* key: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25
  }, */
  visible: {
    type: Boolean,
    required: true,
    default: true
  }
}/* , {
  timestamps: true
} */);

const meetingModel = mongoose.model("Meeting", meetingSchema);

export default meetingModel;
