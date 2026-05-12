import mongoose from "mongoose";
import env from "../config/env.js";

const connectDB = async () => {
    try {
        if (!env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(env.MONGODB_URI, {
            maxPoolSize: 10,
            minPoolSize: 5,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 5000,
        });

        console.log("✅ MongoDB connected successfully");
        return mongoose.connection;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("✅ MongoDB disconnected");
    } catch (error) {
        console.error("❌ MongoDB disconnection failed:", error.message);
    }
};

export { connectDB, disconnectDB };
