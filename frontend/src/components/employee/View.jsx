import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/authContext'

const View = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null);
  const {baseUrl} = useAuth();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          setEmployee(response.data.employee)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      }
    };
    fetchEmployee();
  }, [id]);

  return (
    <>
      {employee ? (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-teal-700 tracking-wide drop-shadow">
            Employee Profile
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <img
                src={`${baseUrl}/${employee.userId.profileImage}`}
                alt="Profile"
                className="rounded-full border-4 border-teal-400 w-48 h-48 object-cover shadow-lg"
              />
            </div>
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                <Detail label="Full Name" value={employee.userId.name} />
                <Detail label="Employee ID" value={employee.employeeId} />
                <Detail label="Date of Birth" value={<span className="font-mono">{new Date(employee.dob).toLocaleDateString()}</span>} />
                <Detail label="Gender" value={capitalize(employee.gender)} />
                <Detail label="Department" value={<span className="font-semibold text-teal-600">{employee.department.dep_name}</span>} />
                <Detail label="Marital Status" value={capitalize(employee.maritalStatus)} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20 text-lg text-gray-600">Loading...</div>
      )}
    </>
  )
}

// Helper to capitalize first letter
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Reusable detail row with enhanced text
const Detail = ({ label, value }) => (
  <div className="flex flex-col mb-2">
    <span className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1">{label}</span>
    <span className="text-gray-900 text-lg font-semibold">{value}</span>
  </div>
);

export default View