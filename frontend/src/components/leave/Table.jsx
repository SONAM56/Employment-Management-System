import React, { useEffect } from 'react'
import { useState } from 'react'
import DataTable from 'react-data-table-component';
import { columns, LeaveButtons } from '../../../utils/LeaveHelper';
import axios from 'axios';
import { useSocket } from '../../context/socketContext';
import { useAuth } from '../../context/authContext';
const Table = () => {
    const socket = useSocket();
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const {baseUrl} = useAuth();
    
    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/leave`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data)
            if (response.status === 200) {
                let sno = 1;
                const data = response.data.leaves
                .filter(leave => leave.employeeId)
                .map((leave) => {

                    const startDate = new Date(leave.startDate);
                    const endDate = new Date(leave.endDate);
                    const diffTime = Math.abs(endDate - startDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return {
                        _id: leave._id,
                        sno: sno++,
                        employeeId: leave.employeeId.employeeId,
                        name: leave.employeeId.userId.name,
                        leaveType: leave.leaveType,
                        department: leave.employeeId.department.dep_name,
                        days: diffDays,
                        status: leave.status,
                        action: (<LeaveButtons Id={leave._id} />),
                    };
                });
                setLeaves(data);
                setFilteredLeaves(data);
            }
        } catch(error) {
            if(error.response && !error.response.data.success) {
                alert(error.response.data.error);
            } else {
                console.error("Error fetching leaves:", error);
            }
        }
    };
    
    useEffect(() => {
        fetchLeaves();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewLeave = (newLeave) => {
            const startDate = new Date(newLeave.startDate);
            const endDate = new Date(newLeave.endDate);
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const formattedLeave = {
                _id: newLeave._id,
                sno: leaves.length + 1,
                employeeId: newLeave.employeeId.employeeId,
                name: newLeave.employeeId.userId.name,
                leaveType: newLeave.leaveType,
                department: newLeave.employeeId.department.dep_name,
                days: diffDays,
                status: newLeave.status,
                action: (<LeaveButtons Id={newLeave._id} />),
            };
            setLeaves(prevLeaves => [formattedLeave, ...prevLeaves]);
            setFilteredLeaves(prevLeaves => [formattedLeave, ...prevLeaves]);
        };

        const handleLeaveDeleted = (deletedId) => {
            setLeaves(prevLeaves => prevLeaves.filter(leave => leave._id !== deletedId));
            setFilteredLeaves(prevLeaves => prevLeaves.filter(leave => leave._id !== deletedId));
        };

        socket.on('leaveAdded', handleNewLeave);
        socket.on('leaveDeleted', handleLeaveDeleted);
        return () => {
            socket.off('leaveAdded', handleNewLeave);
            socket.off('leaveDeleted', handleLeaveDeleted);
        };
    }, [socket, leaves]);

    const filterByInput = (e) => {
        const data = leaves.filter((leave)  =>  leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredLeaves(data);
    };
    const filterByButton = (status) => {
        const data = leaves.filter((leave)  =>  leave.status.toLowerCase().includes(status.toLowerCase()));
        setFilteredLeaves(data);
    };
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">
                    Manage Leaves
                </h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Employee ID"
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-80"
                    onChange={filterByInput}
                />
                <div className="flex gap-2">
                    <button 
                        onClick={() => filterByButton("Pending")}
                        className="px-3 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded"
                    >
                        Pending
                    </button>
                    <button 
                        onClick={() => filterByButton("Approved")}
                        className="px-3 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded"
                    >
                        Approved
                    </button>
                    <button 
                        onClick={() => filterByButton("Rejected")}
                        className="px-3 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded"
                    >
                        Rejected
                    </button>
                </div>
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
                    progressPending={!filteredLeaves}
                    noDataComponent={
                        <p className="text-gray-500 text-center py-6">
                            No leaves found.
                        </p>
                    }
                />
            </div>
        </div>
    );
    // return (
    //     <>
    //         { filteredLeaves ? (
    //             <div className='p-6 max-w-6xl mx-auto'>
    //                 <div className='text-center mb-8'>
    //                     <h3 className='text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow'>Manage Leaves</h3>
    //                 </div> 
    //                 <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-6'>
    //                     <input type="text" placeholder='Search by Emp Name' className='px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-80' onChange={filterByInput} />
    //                     <div className='space-x-2'>
    //                         <button className='px-3 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded' onClick={() => filterByButton ("Pending")}>Pending</button>
    //                         <button className='px-3 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded' onClick={() => filterByButton ("Approved")}>Approved</button>
    //                         <button className='px-3 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded' onClick={() => filterByButton ("Rejected")}>Rejected</button>
    //                     </div>
    //                 </div>
    //                 <DataTable 
    //                     columns={columns} 
    //                     data={filteredLeaves} 
    //                     pagination
    //                     paginationPerPage={5}
    //                     responsive
    //                     highlightOnHover
    //                 />
    //             </div>
    //         ) : (
    //             <div className="flex justify-center items-center h-64">
    //                 <div className="text-lg">Loading....</div>
    //             </div> 
    //         )}
    //     </>
    // );
};

export default Table;