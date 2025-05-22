import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { columns, DepartmentButtons } from '../../../utils/DepartmentHelper'
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const { baseUrl } = useAuth();

  const onDepartmentDelete = async () => {
    fetchDepartments()
  }
  const fetchDepartments = async () => {
    setDepLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/api/department`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        let sno = 1;
        const data = response.data.departments.map((dep) => ({
          _id: dep._id,
          sno: sno++,
          dep_name: dep.dep_name,
          action: (<DepartmentButtons Id={dep._id} onDepartmentDelete={onDepartmentDelete} />)
        }))
        setDepartments(data);
        setFilteredDepartments(data)
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      }
    } finally {
      setDepLoading(false)
    }
  };
  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line
  }, []);
  const filterDepartments = (e) => {
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()))
    setFilteredDepartments(records)
  }
  return (
    <>
      {depLoading ? (
        <div className="text-center text-lg text-gray-600 mt-10">Loading...</div>
      ) : (
        <div className="p-6 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">Manage Departments</h3>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by Department Name"
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-80"
              onChange={filterDepartments}
            />
            <Link
              to="/admin-dashboard/add-department"
              className="px-6 py-2 bg-teal-600 rounded-lg text-white font-semibold shadow hover:bg-teal-700 transition"
            >
              + Add New Department
            </Link>
          </div>
          <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 p-2">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
              paginationPerPage={5} 
              highlightOnHover
              pointerOnHover
              responsive
              noHeader
            />
          </div>
        </div>
      )}
    </>
  )
}

export default DepartmentList
