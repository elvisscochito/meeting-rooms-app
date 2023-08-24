import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 4
  }
})

const roomModel = mongoose.model("Room", roomSchema);

export default roomModel;
