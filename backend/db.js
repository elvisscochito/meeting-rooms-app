import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    res.status(400).json({ error: "Error processing request", details: error.message });
  }
}

export default connectDB;
