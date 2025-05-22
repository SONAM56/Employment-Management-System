import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSocket } from '../../context/socketContext';
import { useAuth } from '../../context/authContext';
const Detail = () => {
    const {id} = useParams()
    const [leave, setLeave] = useState(null)
    const navigate = useNavigate()
    const socket = useSocket();
    const {baseUrl} = useAuth();
    useEffect(() =>{
        const fetchLeave = async () =>{
            try{
                const response = await axios.get(`${baseUrl}/api/leave/detail/${id}`,{
                    headers : {
                        Authorization : `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data)
                if(response.status === 200){
                    setLeave(response.data.leave)
                }
            } catch(error){
                if(error.response && !error.response.data.success){
                alert(error.response.data.error)
                }
            } 
        };
        fetchLeave();
    },[]);
    

    const changeStatus = async (id, status) => {
        try{
            const response = await axios.put(`${baseUrl}/api/leave/${id}`, {status},{
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data)
            if(response.status === 200){
                navigate('/admin-dashboard/leaves')
            }
        } catch(error){
            if(error.response && !error.response.data.success){
            alert(error.response.data.error)
            }
        } 
    }
    
    return (
        <>{ leave ? (
            <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-teal-700 tracking-wide drop-shadow">
                    Leave Details
                </h2>

                <div className="flex flex-col md:flex-row items-start gap-10">
                    {/* Left Column - Image */}
                    <div className="flex-shrink-0">
                        <img 
                            src={`${baseUrl}/${leave.employeeId.userId.profileImage}`} 
                            alt="Profile"
                            className="rounded-full border-4 border-teal-400 w-48 h-48 object-cover shadow-lg"
                        />
                    </div>

                    {/* Right Column - Information */}
                    <div className="w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                            <DetailItem label="Name" value={leave.employeeId.userId.name} />
                            <DetailItem label="Employee ID" value={leave.employeeId.employeeId} />
                            <DetailItem label="Department" value={
                                <span className="font-semibold text-teal-600">
                                    {leave.employeeId.department.dep_name}
                                </span>
                            } />
                            <DetailItem label="Leave Type" value={leave.leaveType} />
                            <DetailItem label="Start Date" value={
                                <span className="font-mono">
                                    {new Date(leave.startDate).toLocaleDateString()}
                                </span>
                            } />
                            <DetailItem label="End Date" value={
                                <span className="font-mono">
                                    {new Date(leave.endDate).toLocaleDateString()}
                                </span>
                            } />
                            <DetailItem 
                                label="Reason" 
                                value={leave.reason} 
                                className="sm:col-span-2"
                            />
                            <DetailItem 
                                label={leave.status === "Pending" ? "Action Required" : "Status"} 
                                value={
                                    leave.status === "Pending" ? (
                                        <div className="flex gap-3 mt-2">
                                            <button 
                                                onClick={() => changeStatus(id, "Approved")}
                                                className="px-4 py-2 bg-green-500 text-white rounded 
                                                        hover:bg-green-600 transition-colors text-sm font-semibold"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => changeStatus(id, "Rejected")}
                                                className="px-4 py-2 bg-red-500 text-white rounded 
                                                        hover:bg-red-600 transition-colors text-sm font-semibold"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                                            ${leave.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 
                                            leave.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            {capitalize(leave.status)}
                                        </span>
                                    )
                                }
                                className="sm:col-span-2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center mt-20 text-lg text-gray-600">Loading...</div>
        )}</>
    );
   
};


// Helper Components
const DetailItem = ({ label, value, className = "" }) => (
    <div className={`flex flex-col mb-2 ${className}`}>
        <span className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1">
            {label}
        </span>
        <span className="text-gray-900 text-lg font-semibold">
            {value}
        </span>
    </div>
);

// Helper function to capitalize first letter
const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export default Detail;
