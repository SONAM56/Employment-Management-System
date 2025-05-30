import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../../../utils/EmployeeHelper';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
const Edit = () => {
    const [employee, setEmployee] = useState({
        name: '',
        maritalStatus: '',
        designation: '',
        salary: 0,
        department: ''
    });
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();
    const {id} = useParams();
    const {baseUrl} = useAuth();

    useEffect(()=> {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments)
        };
        getDepartments();
    },[]);
    useEffect(()=> {
        const fetchEmployee = async () =>{
            try{
                const responnse = await axios.get(`${baseUrl}/api/employee/${id}`,{
                    headers : {
                        Authorization : `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if(responnse.data.success){
                    const employee = responnse.data.employee;
                    setEmployee((prev) => ({
                        ...prev, 
                        name: employee.userId.name,
                        maritalStatus: employee.maritalStatus,
                        designation: employee.designation,
                        salary: employee.salary,
                        department: employee.department
                    }));
                }
            } catch(error){
                if(error.response && !error.response.data.success){
                alert(error.response.data.error)
                }
            } 
        };
        fetchEmployee();
    },[])

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setEmployee((preData) => ({...preData, [name]: value}));
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.put(`${baseUrl}/api/employee/${id}`, employee, {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                },
            });
            if(response.data.success){
                navigate('/admin-dashboard/employees');
            }
        } catch(error){
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
    }
  return (
    <>{ departments && employee ? (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
       <h2 className='text-2xl font-bold mb-6'>Edit Employee</h2>
       <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */} 
                <div>
                    <label className='block text-sm font-medium text-gray-700' htmlFor="name">Name</label>
                    <input type="text" name='name' value={employee.name} onChange={handleChange} placeholder='Insert Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                </div>
                {/* Marital Status */}
                <div>
                    <label htmlFor="maritalStatus"className='block text-sm font-medium text-gray-700'>Marital Status</label>
                    <select name="maritalStatus" value={employee.maritalStatus} onChange={handleChange} placeholder="Marital Status" className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                    </select>
                </div>
                {/* Designation */}
                <div>
                    <label htmlFor="designation" className='block text-sm font-medium text-gray-700'>Designation</label>
                    <input type="text" name='designation' onChange={handleChange} value={employee.designation} placeholder='Designation' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                </div> 
                {/* Salary */}
                <div>
                    <label htmlFor="salary" className='block text-sm font-medium text-gray-700'>Salary</label>
                    <input type="number" name='salary' value={employee.salary} onChange={handleChange} placeholder='Salary' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                </div>
                {/* Department */}
                <div className='col-span-2'>
                    <label htmlFor="department"className='block text-sm font-medium text-gray-700'>Department</label>
                    <select name="department" onChange={handleChange} value={employee.department} placeholder="Marital Status" className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Department</option>
                        {departments.map((dep) => (
                            <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button type='submit' className=' w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>Edit Employee</button>
       </form>
    </div>
    ) : <div>Loading....</div>}</>
  )
}

export default Edit;
