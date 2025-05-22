import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillWave, FaTachometerAlt, FaTasks, FaUsers} from 'react-icons/fa'
import {useAuth} from "../../context/authContext";
import axios from 'axios';

const Sidebar = () => {
    const {user} = useAuth();
    const {baseUrl} = useAuth();
   const [employeeId,setEmployeeId] = useState([])
   useEffect(()=>{
    fetchEmployee()
   },[])
   
   const fetchEmployee = async ()=>{
    try {
        const response = await axios.get(`${baseUrl}/api/employee/user/${user._id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        const data = response.data
        console.log(data)
        if(response.status === 200){
            setEmployeeId(data.employee)
        }

    } catch (error) {
        console.log(error)
    }
   }

  return (
    <div className='bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
        <div className='bg-teal-600 h-12 flex items-center justify-center'>
            <h3 className='text-2xl text-center font-roboto'>Employee Ms</h3>
        </div>
        <div className='px-4'>
            <NavLink to="/employee-dashboard"
                className={({isActive}) => `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4  py-2.5 px-4 rounded`} end>
                <FaTachometerAlt/>
                <span>Dashboard</span>
            </NavLink>
            <NavLink to={`/employee-dashboard/profile/${user._id}`}
                className={({isActive}) => `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4  py-2.5 px-4 rounded`} end>
                <FaUsers /> 
                <span>My Profile</span>
            </NavLink>
            <NavLink to={`/employee-dashboard/attendance/${user._id}`}
                className={({ isActive }) => `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4  py-2.5 px-4 rounded`}>
                <FaCalendarAlt />
                <span>Attendance</span>
            </NavLink>
            <NavLink to={`/employee-dashboard/show-task/${employeeId._id}`}
                className={({isActive}) => `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4  py-2.5 px-4 rounded`}>
                <FaTasks />
                <span>My Tasks</span>
            </NavLink>
            <NavLink to={`/employee-dashboard/leaves/${user._id}`}
                className={({isActive}) => `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4  py-2.5 px-4 rounded`}>
                <FaCalendarAlt />
                <span>Leaves</span>
            </NavLink>
            <NavLink to={`/employee-dashboard/salary/${user._id}`}
                className={({isActive}) => `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4  py-2.5 px-4 rounded`}>
                <FaMoneyBillWave />
                <span>Salary</span>
            </NavLink>
            
            <NavLink to="/employee-dashboard/setting"
                className={({isActive}) => `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4  py-2.5 px-4 rounded`} end>
                <FaCogs />
                <span>Setting</span>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar
