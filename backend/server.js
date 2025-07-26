import dotenv from 'dotenv';

// Configure dotenv
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

const app = express();

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// this is necessary for multer to store temporary files before uploading to Cloudinary
const tempDir = path.join(__dirname, 'public', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
app.use(cors({
    origin: `${process.env.FRONTEND_URL || "http://localhost:5173"}`, 
    credentials: true, //frontend to send requests 
}));


app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/user',userRoutes);


app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
}   );
