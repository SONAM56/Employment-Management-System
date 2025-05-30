import React, { useEffect, useState } from 'react';
import { fetchDepartments, getEmployees } from '../../../utils/EmployeeHelper';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
const Add = () => {
    const [salary, setSalary] = useState({
        employeeId: null,
        salaryperHour: 0,
        allowance: 0,
        deductions: 0,
        assignDate: null,
    });
    const [departments, setDepartments] = useState(null);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const {baseUrl} = useAuth();

    useEffect(()=> {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments)
        };
        getDepartments();
    },[]);

    const handleDepartment = async (e) => {
        const emps = await getEmployees(e.target.value)
        setEmployees(emps)
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setSalary((prevData) => ({...prevData, [name]: value }));
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post(`${baseUrl}/api/salary/add`, salary, {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                },
            });
            if(response.data.success){
                navigate('/admin-dashboard/salary');
            }
        } catch(error){
            if(error.response && !error.response.data.success){
                alert(error.response.data.error);
            }
        }
    };
  return (
    <>{ departments ? (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
       <h2 className='text-2xl font-bold mb-6'> Add Salary</h2>
       <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Department */}
                <div>
                    <label htmlFor="department"className='block text-sm font-medium text-gray-700'>Department</label>
                    <select name="department" onChange={handleDepartment}  className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Department</option>
                        {departments.map((dep) => (
                            <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                        ))}
                    </select>
                </div>
                {/* employee */}
                <div>
                    <label htmlFor="employeeId" className='block text-sm font-medium text-gray-700'>Employee</label>
                    <select name="employeeId" onChange={handleChange}   className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                        ))}
                    </select>
                </div>
                {/* Basic Salary */}
                <div>
                    <label htmlFor="salaryperHour" className='block text-sm font-medium text-gray-700'>Salary Per Hours</label>
                    <input type="number" name='salaryperHour' onChange={handleChange}  placeholder='salary per hours' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                </div> 
                {/* allowance */}
                <div>
                    <label htmlFor="allowances" className='block text-sm font-medium text-gray-700'>Allowances</label>
                    <input type="number" name='allowances' onChange={handleChange} placeholder='allowances' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                </div>
                {/*Deductions */}
                <div>
                    <label htmlFor="deductions" className='block text-sm font-medium text-gray-700'>Deductions</label>
                    <input type="number" name='deductions' onChange={handleChange} placeholder='deductions' className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                </div>
                {/*Pay Date */}
                <div>
                    <label htmlFor="assignDate" className='block text-sm font-medium text-gray-700'>Assign Date</label>
                    <input type="date" name='assignDate' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                </div>
                
            </div>
            <button type='submit' className=' w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>Add Salary</button>
       </form>
    </div>
    ) : <div>Loading....</div>}</>
  )
}

export default Add;
