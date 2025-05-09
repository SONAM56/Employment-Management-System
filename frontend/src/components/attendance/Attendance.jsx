// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FaCalendarAlt } from 'react-icons/fa';

// const Attendance = () => {
//     const [logs, setLogs] = useState([]);
//     // Set initial selectedDate to today
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Fetch attendance logs based on the selected date
//     const fetchLogs = async (date) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const params = {};
//             if (date) params.date = date.toISOString();

//             const response = await axios.get('http://localhost:5000/api/activity-log/filter', {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 params,
//             });
//             setLogs(response.data);
//         } catch (error) {
//             console.error('Error fetching attendance logs:', error);
//             setError('Failed to fetch attendance logs. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (selectedDate) {
//             fetchLogs(selectedDate);
//         }
//     }, [selectedDate]);

//     return (
//         <div className="container mx-auto p-6">
//             <h2 className="text-3xl font-bold mb-6 text-center text-black-600">Attendance Logs</h2>
//             <div className="flex justify-end mb-3">
//                 <div className="flex items-center space-x-2">
//                     <FaCalendarAlt className="text-teal-500 text-xl" />
//                     <DatePicker
//                         selected={selectedDate}
//                         onChange={(date) => setSelectedDate(date)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                         placeholderText="Select a date"
//                         maxDate={new Date()}
//                     />
//                 </div>
//             </div>
//             {loading ? (
//                 <p className="text-gray-600 text-center">Loading attendance logs...</p>
//             ) : error ? (
//                 <p className="text-red-600 text-center">{error}</p>
//             ) : logs.length > 0 ? (
//                 <table className="min-w-full bg-white border border-gray-200">
//                     <thead>
//                         <tr>
//                             <th className="py-2 px-4 border-b">Employee Name</th>
//                             <th className="py-2 px-4 border-b">Login Time</th>
//                             <th className="py-2 px-4 border-b">Logout Time</th>
//                             <th className="py-2 px-4 border-b">Day of Log</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {logs.map((log) => (
//                             <tr key={log._id} className="hover:bg-gray-100">
//                                 <td className="py-2 px-4 border-b">{log.employeeName}</td>
//                                 <td className="py-2 px-4 border-b">{new Date(log.loginTime).toLocaleString()}</td>
//                                 <td className="py-2 px-4 border-b">
//                                     {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : 'N/A'}
//                                 </td>
//                                 <td className="py-2 px-4 border-b">{new Date(log.dayOfLog).toLocaleDateString()}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p className="text-gray-600 text-center">No attendance logs available for the selected date.</p>
//             )}
//         </div>
//     );
// };

// export default Attendance;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const Attendance = () => {
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLogs = async (date) => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (date) params.date = date.toISOString();

            const response = await axios.get('http://localhost:5000/api/activity-log/filter', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params,
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching attendance logs:', error);
            setError('Failed to fetch attendance logs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchLogs(selectedDate);
        }
    }, [selectedDate]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-teal-700 tracking-wide drop-shadow">Attendance Logs</h2>
            <div className="flex justify-end mb-4">
                <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-teal-500 text-xl" />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholderText="Select a date"
                        maxDate={new Date()}
                    />
                </div>
            </div>
            {loading ? (
                <p className="text-gray-600 text-center text-lg">Loading attendance logs...</p>
            ) : error ? (
                <p className="text-red-600 text-center text-lg">{error}</p>
            ) : logs.length > 0 ? (
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                    <table className="min-w-full text-base text-left text-gray-800">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="py-3 px-6 font-bold uppercase tracking-wider">Employee Name</th>
                                <th className="py-3 px-6 font-bold uppercase tracking-wider">Login Time</th>
                                <th className="py-3 px-6 font-bold uppercase tracking-wider">Logout Time</th>
                                <th className="py-3 px-6 font-bold uppercase tracking-wider">Day of Log</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-100">
                                    <td className="py-3 px-6 border-b font-medium">{log.employeeName}</td>
                                    <td className="py-3 px-6 border-b font-mono">{new Date(log.loginTime).toLocaleString()}</td>
                                    <td className="py-3 px-6 border-b font-mono">
                                        {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : <span className="italic text-gray-400">N/A</span>}
                                    </td>
                                    <td className="py-3 px-6 border-b font-mono">{new Date(log.dayOfLog).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center text-lg">No attendance logs available for the selected date.</p>
            )}
        </div>
    );
};

export default Attendance;