import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EmployeeAttendance = () => {
    const { id } = useParams(); // Get employee ID from the URL
    const [logs, setLogs] = useState([]);

    // Fetch attendance logs for the respective employee
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/activity-log/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },   
                });
                console.log(response.data);
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching attendance logs:', error);
            }
        };
        fetchLogs();
    }, [id]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-black-600">My Attendance Logs</h2>
            {logs.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-y-auto">
                    <thead className="bg-teal-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Login Time</th>
                            <th className="py-3 px-4 text-left">Logout Time</th>
                            <th className="py-3 px-4 text-left">Day of Log</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr
                                key={log._id}
                                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                            >
                                <td className="py-3 px-4 border-b">{new Date(log.loginTime).toLocaleString()}</td>
                                <td className="py-3 px-4 border-b">
                                    {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'N/A'}
                                </td>
                                <td className="py-3 px-4 border-b">{new Date(log.dayOfLog).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600 text-center mt-6">No attendance logs available.</p>
            )}
        </div>
    );
};

export default EmployeeAttendance;