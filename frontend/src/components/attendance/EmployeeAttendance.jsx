import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useAuth } from '../../context/authContext';

const EmployeeAttendance = () => {
    const { id } = useParams();
    const [logs, setLogs] = useState([]);
    const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [loading, setLoading] = useState(false);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [search, setSearch] = useState('');
    const { baseUrl} = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${baseUrl}/api/activity-log/employee/${id}?month=${month}&year=${year}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setLogs(response.data.logs || response.data);
            } catch (error) {
                console.error('Error fetching attendance logs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [id, month, year]);

    useEffect(() => {
        if (!search) {
            setFilteredLogs(logs);
        } else {
            setFilteredLogs(
                logs.filter(
                    log =>
                        (log.dayOfLog && new Date(log.dayOfLog).toLocaleDateString().toLowerCase().includes(search.toLowerCase()))
                )
            );
        }
    }, [logs, search]);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const columns = [
        {
            name: <span className="font-bold uppercase tracking-wider text-sm">SNO</span>,
            selector: (row, idx) => idx + 1,
            width: "70px",
            cell: (row, idx) => <span className="font-semibold">{idx + 1}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm">Login Time</span>,
            selector: row => new Date(row.loginTime).toLocaleString(),
            sortable: true,
            grow: 2,
            cell: row => <span className="font-mono text-[15px] text-gray-800">{new Date(row.loginTime).toLocaleString()}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm">Logout Time</span>,
            selector: row => row.logoutTime ? new Date(row.logoutTime).toLocaleString() : 'N/A',
            sortable: true,
            grow: 2,
            cell: row => (
                row.logoutTime
                    ? <span className="font-mono text-[15px] text-gray-800">{new Date(row.logoutTime).toLocaleString()}</span>
                    : <span className="text-gray-400 text-[15px]">N/A</span>
            )
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm">Day of Log</span>,
            selector: row => new Date(row.dayOfLog).toLocaleDateString(),
            sortable: true,
            cell: row => <span className="text-[15px] text-gray-700">{new Date(row.dayOfLog).toLocaleDateString()}</span>
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">My Attendance Logs</h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Date"
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-80"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex gap-2">
                    <select
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 bg-white"
                    >
                        {monthNames.map((name, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-teal-400"
                        min="2000"
                        max={new Date().getFullYear() + 5}
                    />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-200 p-2">
                <DataTable
                    columns={columns}
                    data={filteredLogs}
                    pagination
                    paginationPerPage={5}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    noHeader
                    progressPending={loading}
                    noDataComponent={<p className="text-gray-500 text-center text-lg mt-8">No attendance logs available for the selected month.</p>}
                />
            </div>
        </div>
    );
};

export default EmployeeAttendance;