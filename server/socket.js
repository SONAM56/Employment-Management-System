import { Server } from 'socket.io';
import ActivityLog from './models/ActivityLog.js';

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('login', async (data) => {
            const { employeeName, loginTime, role } = data;
            if (role !== 'admin') {
                const log = new ActivityLog({ 
                    employeeName, 
                    loginTime, 
                    dayOfLog: new Date(loginTime).setHours(0, 0, 0, 0) 
                });
                await log.save();
                io.emit('login', log);
            }
        });

        socket.on('logout', async (data) => {
            const { employeeName, logoutTime, role } = data;
            if (role !== 'admin') {
                const log = await ActivityLog.findOne({ employeeName }).sort({ createdAt: -1 });
                if (log) {
                    log.logoutTime = logoutTime;
                    await log.save();
                    io.emit('logout', log);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

export default initializeSocket;