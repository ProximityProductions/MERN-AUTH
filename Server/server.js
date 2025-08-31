import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
dotenv.config()

const App = express()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err.message);
        process.exit(1); 
    }
}


const allowedOrigins = "http://localhost:5173"
connectDB();
App.use(express.json());
App.use(cookieParser());
App.use(cors({credentials:true, origin:allowedOrigins}));

//API Endpoints
App.get('/', (req, res)=>{
    res.send("Welcome to the Auth API");
});
App.use('/api/auth/',authRouter)
App.use('/api/user/',userRouter)
App.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})