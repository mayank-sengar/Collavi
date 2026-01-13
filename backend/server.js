import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';    
import userRoutes from './routes/user.route.js'
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.route.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {app, server, io} from './SocketIO/server.js'; 
import { asyncHandler } from './utils/asyncHandler.js';
import exeRedisClient from './utils/redisClient.js';

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// this is necessary for multer to store temporary files before uploading to Cloudinary
const tempDir = path.join(__dirname, 'public', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
app.use(cors({
  //whitelisting
    origin: `${process.env.FRONTEND_URL || "http://localhost:5173"}`, 
    credentials: true, //frontend to send requests 
    //backend also allows cookies / tokens to be sent across origins.
}));


app.use(express.json());
app.use(cookieParser());

connectDB();
const redisClient = await exeRedisClient();
export default redisClient;

app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/user',userRoutes);

// Global error handler
app.use((err, req, res, next) => {
    // If the error is an instance of ApiError, use its status and message
    if (err && err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null
        });
    }
    // Otherwise, fallback to generic 500
    res.status(500).json({
        success: false,
        message: err?.message || "Internal Server Error",
        data: null
    });
});



server.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
}   );
