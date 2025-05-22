import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import DataTable from 'react-data-table-component';
import { useSocket } from '../../context/socketContext';

const List = () => {
    const socket = useSocket();
    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState('');
    const { id } = useParams();
    const { user } = useAuth();
    const {baseUrl} = useAuth();
    const userId = id || user._id;

    
    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/leave/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.leaves) {
                    setLeaves(response.data.leaves);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.message);
                }
            }
        };
        fetchLeaves();
    }, [userId]);
    useEffect(() => {
        if (!socket) return;
        const handleStatusUpdate = (updatedLeave) => {
            setLeaves(prevLeaves => prevLeaves.map(leave =>
                leave._id === updatedLeave._id ? { ...leave, status: updatedLeave.status } : leave
            ));
        };
        const handleNewLeave = (newLeave) => {
            if (newLeave.employeeId._id === userId) {
                setLeaves(prevLeaves => [...prevLeaves, newLeave]);
            }
        };
        
        const handleLeaveDeleted = (deletedId) => {
            setLeaves(prevLeaves => prevLeaves.filter(leave => leave._id !== deletedId));
        };

        socket.on('statusUpdated', handleStatusUpdate);
        socket.on('leaveAdded', handleNewLeave);
        socket.on('leaveDeleted', handleLeaveDeleted);
        // Clean up
        return () => {
            socket.off('statusUpdated', handleStatusUpdate);
            socket.off('leaveAdded', handleNewLeave);
            socket.off('leaveDeleted', handleLeaveDeleted);
        };
    }, [socket, userId]);
    // Filter leaves by leaveType or reason
    const filteredLeaves = leaves.filter(leave =>
        leave.leaveType.toLowerCase().includes(search.toLowerCase()) ||
        leave.reason.toLowerCase().includes(search.toLowerCase())
    );
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this leave?')) {
            try {
                const response = await axios.delete(`${baseUrl}/api/leave/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                
                if (response.data.success) {
                    setLeaves(prevLeaves => prevLeaves.filter(leave => leave._id !== id));
                }
            } catch (error) {
                alert(error.response?.data?.error || 'Error deleting leave');
            }
        }
    };
    const columns = [
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">SNO</span>,
            selector: (row) => filteredLeaves.indexOf(row) + 1,
            width: "70px",
            cell: (row, idx) => <span className="font-semibold text-gray-800">{filteredLeaves.indexOf(row) + 1}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Leave Type</span>,
            selector: row => row.leaveType,
            sortable: true,
            cell: row => <span className="text-base text-gray-700">{row.leaveType}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">From</span>,
            selector: row => new Date(row.startDate).toLocaleDateString(),
            sortable: true,
            cell: row => <span className="text-base text-gray-700">{new Date(row.startDate).toLocaleDateString()}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">To</span>,
            selector: row => new Date(row.endDate).toLocaleDateString(),
            sortable: true,
            cell: row => <span className="text-base text-gray-700">{new Date(row.endDate).toLocaleDateString()}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Description</span>,
            selector: row => row.reason,
            grow: 2,
            cell: row => <span className="text-base text-gray-600">{row.reason}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Status</span>,
            selector: row => row.status,
            sortable: true,
            cell: row => {
                let statusStyle = '';
                switch(row.status.toLowerCase()) {  // Convert to lowercase for comparison
                    case 'approved':
                        statusStyle = 'bg-green-500 text-white';
                        break;
                    case 'pending':
                        statusStyle = 'bg-yellow-500 text-white';
                        break;
                    case 'rejected':
                        statusStyle = 'bg-red-500 text-white';
                        break;
                    default:
                        statusStyle = 'bg-gray-500 text-white';
                }
                
                return (
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyle}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                );
            }
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Action</span>,
            cell: row => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold 
                             hover:bg-red-700 transition-colors duration-200 flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </button>
            )
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">My Leaves</h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Leave Type or Reason"
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-80"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {user.role === "employee" && (
                    <Link
                        className="px-6 py-2 bg-teal-600 rounded-lg text-white font-semibold shadow hover:bg-teal-700 transition"
                        to="/employee-dashboard/add-leave"
                    >
                        + Add New Leave
                    </Link>
                )}
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-200 p-2">
                <DataTable
                    columns={columns}
                    data={filteredLeaves}
                    pagination
                    paginationPerPage={5}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    noHeader
                    progressPending={leaves === null}
                    noDataComponent={<p className="text-gray-500 text-center py-6">No leaves found.</p>}
                />
            </div>
        </div>
    )
}

export default List
