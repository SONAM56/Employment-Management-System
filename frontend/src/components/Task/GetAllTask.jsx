import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const GetAllTask = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const {baseUrl} = useAuth();

    // Fetch tasks from API
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/employee/task/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusUpdate = async (taskId) => {
        try {
            const response = await axios.patch(
                `${baseUrl}/api/tasks/${taskId}/status`,
                { status: 'Completed' },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.data.success) {
                fetchTasks(); // Refresh tasks after update
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const columns = [
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">S.N</span>,
            selector: (row,index) => index+1,
            sortable: true,
            width: '120px'
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Title</span>,
            selector: row => row.taskName,
            sortable: true,
            grow: 2
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">User</span>,
            selector: row => row.employeeName,
            sortable: true,
            grow: 2
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Description</span>,
            selector: row => row.taskDescription,
            grow: 3,
            cell: row => (
                <div className="py-2">
                    <p className="text-gray-600 whitespace-normal">{row.taskDescription}</p>
                </div>
            )
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Due Date</span>,
            selector: row => row.dueDate,
            sortable: true,
            cell: row => <span>{new Date(row.dueDate).toLocaleDateString()}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Status</span>,
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    row.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {row.status}
                </span>
            )
        },
        // {
        //     name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Action</span>,
        //     cell: row => (
        //         <button
        //             onClick={() => handleStatusUpdate(row._id)}
        //             disabled={row.status === 'Completed'}
        //             className={`px-3 py-1 rounded-lg text-sm font-semibold
        //                 ${row.status === 'Completed' 
        //                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
        //                     : 'bg-teal-600 text-white hover:bg-teal-700'
        //                 } transition-colors duration-200`}
        //         >
        //             Mark Complete
        //         </button>
        //     ),
        //     width: '150px'
        // }
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
            },
        },
        rows: {
            style: {
                minHeight: '52px',
                '&:hover': {
                    backgroundColor: '#f1f5f9',
                },
            },
        },
    };

    const filteredItems = tasks.filter(
        item => item.taskName.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">
                    My Tasks
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Task Title"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-80
                                 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                    <Link
                        to="/admin-dashboard/add-task"
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold
                                 hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M12 4v16m8-8H4" />
                        </svg>
                        Assign New Task
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredItems}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    responsive
                    progressPending={loading}
                    progressComponent={
                        <div className="py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent mx-auto"></div>
                        </div>
                    }
                    noDataComponent={
                        <div className="py-8 text-center text-gray-500">
                            No tasks found
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default GetAllTask;