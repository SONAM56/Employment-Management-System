import express from 'express'
import cors from 'cors'
import authRouter from "./routes/auth.js"
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import connectToDatabase from './db/db.js'
import leaveRouter from "./routes/leave.js"
// new code
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import initializeSocket from './socket.js';

connectToDatabase();

const app = express();
// new code
dotenv.config();
const server = http.createServer(app);
initializeSocket(server);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors())
app.use(express.json())
app.use(express.static('public/uploads'))

app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave', leaveRouter)

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{
    console.log(`Server is Running on port ${process.env.PORT}`)
})
