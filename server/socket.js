import { Server } from 'socket.io';
import ActivityLog from './models/ActivityLog.js';
import Leave from './models/Leave.js';
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
let io = null;

const initializeSocket = (server) => {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: FRONTEND_URL,
                methods: ['GET', 'POST', 'OPTIONS'],
                allowedHeaders: ['Authorization'],
                credentials: true,              // Allow cookies and credentials
            },
            transports: ['websocket', 'polling'], 
        });
    
        io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);
    
            socket.on('login', async (data) => {
                try {
                    const { employeeName, loginTime, role, userId } = data;
                    console.log('Received login event:', data); 
                    if (role !== 'admin') {
                        const log = new ActivityLog({ 
                            userId,
                            employeeName, 
                            loginTime, 
                            dayOfLog: new Date(loginTime).setHours(0, 0, 0, 0) 
                        });
                        await log.save();
                        io.emit('login', log);
                    }
                }catch(error) {
                    console.error('Error handling login event:', error);
                }
            });
    
            socket.on('logout', async (data) => {
                try {
                    const { employeeName, logoutTime, role, userId } = data;
                    console.log('Received logout event:', data); 
                    if (role !== 'admin') {
                        const log = await ActivityLog.findOne({ userId }).sort({ createdAt: -1 });
                        if (log) {
                            log.logoutTime = logoutTime;
                            await log.save();
                            io.emit('logout', log);
                        }
                    }
                }catch(error) {
                    console.error('Error handling logout event:', error);
                }
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    return io;
};

export { io };
export default initializeSocket;