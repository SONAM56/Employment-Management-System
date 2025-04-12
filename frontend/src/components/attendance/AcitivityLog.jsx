import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/socketContext';
import axios from 'axios';
const ActivityLog = () => {
    const socket = useSocket();
    const [logs, setLogs] = useState([]);

    // Fetch logs from the server when the component mounts
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/activity-log/today');
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, []);


    useEffect(() => {
        if (socket) {
            console.log('Socket connected:', socket);
            socket.on('login', (log) => {
                setLogs((prevLogs) => [...prevLogs, log]);
            });

            socket.on('logout', (log) => {
                setLogs((prevLogs) => 
                    prevLogs.map((l) => (l._id === log._id ? log : l))
                );
            });

            return () => {
                socket.off('login');
                socket.off('logout');
            };
        }
    }, [socket]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Activity Log</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Employee Name</th>
                        <th className="py-2 px-4 border-b">Login Time</th>
                        <th className="py-2 px-4 border-b">Logout Time</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{log.employeeName}</td>
                            <td className="py-2 px-4 border-b">{new Date(log.loginTime).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">
                                {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityLog;