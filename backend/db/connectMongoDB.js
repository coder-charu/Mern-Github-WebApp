import mongoose from "mongoose";

export default async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!!");
  } catch (error) {
    console.log("Error connecting to DB :", error.message);
  }
}
