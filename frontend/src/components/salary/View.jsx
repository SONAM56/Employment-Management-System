
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useAuth } from '../../context/authContext';

const View = () => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const {baseUrl} = useAuth();
 
    const columns = [
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">SNO</span>,
            selector: (row, index) => index + 1,
            sortable: true,
            width: '80px',
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Employee Name</span>,
            selector: row => row.employeeName || row.employeeId,
            sortable: true,
            grow: 2,
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Salary/Hour</span>,
            selector: row => row.salaryperHour,
            sortable: true,
            cell: row => <span className="font-mono">${row.salaryperHour.toFixed(2)}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Allowance</span>,
            selector: row => row.allowances,
            sortable: true,
            cell: row => <span className="font-mono text-green-600">+${row.allowances.toFixed(2)}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Deduction</span>,
            selector: row => row.deductions,
            sortable: true,
            cell: row => <span className="font-mono text-red-600">-${row.deductions.toFixed(2)}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Assign Date</span>,
            selector: row => row.assignDate,
            sortable: true,
            cell: row => <span>{new Date(row.assignDate).toLocaleDateString()}</span>
        },
        {
            name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Action</span>,
            cell: row => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-semibold 
                             hover:bg-red-600 transition-colors duration-200 flex items-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </button>
            ),
            width: '150px',
        }
    ];

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderRadius: '8px',
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

    const fetchSalaries = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/api/salary`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            
            if (response.data.success) {
                setSalaries(response.data.salaries);
            }
        } catch (error) {
            console.error('Error fetching salaries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, []);

    const handleDelete = async (salaryId) => {
        if(window.confirm("Are you sure you want to delete this salary record?")) {
            try {
                await axios.delete(`${baseUrl}/api/salary/${salaryId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                fetchSalaries();
            } catch (error) {
                alert("Failed to delete salary record");
            }
        }
    };

    const filteredItems = salaries.filter(
        item => (item.employeeName || item.employeeId)
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">
                    Salary Management
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Employee Name"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-80
                                 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                    <Link
                        to="/admin-dashboard/salary/add"
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold
                                 hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Salary
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
                            No salary records found
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default View;