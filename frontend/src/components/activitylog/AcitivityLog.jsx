import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/socketContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
const ActivityLog = () => {
    const socket = useSocket();
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();
    const {baseUrl} = useAuth();
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/activity-log/today`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, []);

    useEffect(() => {
        if (socket) {
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
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-teal-700 tracking-wide drop-shadow">Activity Log</h2>
            <div className="flex justify-end mb-6">
                <button
                    className="px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition"
                    onClick={() => navigate("/admin-dashboard/activitylog/set-time")}
                >
                    Set Time
                </button>
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="py-3 px-6 font-bold uppercase tracking-wider text-base">Employee Name</th>
                            <th className="py-3 px-6 font-bold uppercase tracking-wider text-base">Login Time</th>
                            <th className="py-3 px-6 font-bold uppercase tracking-wider text-base">Logout Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-500 text-base">
                                    No activity logs for today.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-100">
                                    <td className="py-3 px-6 border-b font-medium">{log.employeeName}</td>
                                    <td className="py-3 px-6 border-b font-mono">{new Date(log.loginTime).toLocaleString()}</td>
                                    <td className="py-3 px-6 border-b font-mono">
                                        {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : <span className="italic text-gray-400">N/A</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityLog;