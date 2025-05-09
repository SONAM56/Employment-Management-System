import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useAuth} from '../../context/authContext';
import axios from 'axios';
const List = () => {
  const {user} = useAuth()
  const [leaves, setLeaves] = useState([])
  let sno = 1;
  const fetchLeaves  = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/leave/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.data.leaves) {
                setLeaves(response.data.leaves);
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                alert(error.message);
            }
        }
    }
    useEffect(() => {
        fetchLeaves();
    },[]);
  return (
    <div className='p-6'>
        <div className='text-center'>
            <h3 className='text-2xl font-bold'>Manage Leaves</h3>
        </div> 
        <div className='flex justify-between items-center'>
            <input type="text" placeholder='Search by Dep Name' className='px-4 py-0.5 border' />
            <Link className='px-4 py-1 bg-teal-600 rounded text-white' to="/employee-dashboard/add-leave">Add New Leave</Link>
        </div>
        <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200'>
                    <tr>
                        <th className='px-6 py-3'>SNO</th>
                        <th className='px-6 py-3'>Leave Type</th>
                        <th className='px-6 py-3'>From</th>
                        <th className='px-6 py-3'>To</th>
                        <th className='px-6 py-3'>Decription</th>
                        <th className='px-6 py-3'>Status</th>
                    </tr> 
                </thead>
                <tbody>
                    {leaves.map((leave) => (
                        <tr key={leave._id} className='bg-white border-b bg-gray-600 border-gray-700 text-white'>
                            <td className='px-6 py-3'>{sno++}</td>
                            <td className='px-6 py-3'>{leave.leaveType}</td>
                            <td className='px-6 py-3'>{new Date(leave.startDate).toLocaleDateString()}</td>
                            <td className='px-6 py-3'>{new Date(leave.endDate).toLocaleDateString()}</td>
                            <td className='px-6 py-3'>{leave.reason}</td>
                            <td className='px-6 py-3'>{leave.status}</td>
                        </tr>       
                    ))}
                </tbody>
            </table>   
    </div>
  )
}

export default List
