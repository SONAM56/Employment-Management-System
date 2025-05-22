import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../../utils/EmployeeHelper'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { useAuth } from '../../context/authContext'

const List = () => {
  const [employees, setEmployees] = useState([])
  const [empLoading, setEmpLoading] = useState(false)
  const [filteredEmployee, setFilteredEmployees] = useState([])
  const {baseUrl} = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true)
      try {
        const responnse = await axios.get(`${baseUrl}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        console.log(responnse.data);
        if (responnse.data.success) {
          let sno = 1;
          const data = responnse.data.employees
          .filter(emp => emp.userId)
          .map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: <img width={40} className="w-16 h-16 rounded-full object-cover" src={`${baseUrl}/${emp.userId.profileImage}`} alt="profile" />,
            action: (<EmployeeButtons Id={emp._id} />),
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setEmpLoading(false)
      }
    };
    fetchEmployees();
  }, []);

  // Improved filter: search by department or name
  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.dep_name.toLowerCase().includes(value) ||
      emp.name.toLowerCase().includes(value)
    );
    setFilteredEmployees(records)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">Manage Employees</h3>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Department or Name"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-80"
          onChange={handleFilter}
        />
         <Link
          to="/admin-dashboard/show-user-task"
          className="px-6 py-2 bg-teal-600 rounded-lg text-white font-semibold shadow hover:bg-teal-700 transition"
        >
          Show Tasks
        </Link>
        <Link
          to="/admin-dashboard/add-employee"
          className="px-6 py-2 bg-teal-600 rounded-lg text-white font-semibold shadow hover:bg-teal-700 transition"
        >
          + Add New Employee
        </Link>
      </div>
      <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 p-2">
        <DataTable
          columns={columns}
          data={filteredEmployee}
          progressPending={empLoading}
          pagination
          paginationPerPage={5}      
          highlightOnHover
          pointerOnHover
          responsive
          noHeader
        />
      </div>
    </div>
  )
}

export default List