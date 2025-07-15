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

const app = express();
app.use(cors({
    origin: `${process.env.FRONTEND_URL || "http://localhost:5173"}`, 
    credentials: true //allow frontend to send requests 
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
