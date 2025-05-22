import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { useAuth } from "../../context/authContext";

const SalaryDetails = () => {
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const {baseUrl} = useAuth();

  // Month and year state
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));

  // Column definitions for DataTable
  const columns = [
    {
      name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Salary/Hour</span>,
      selector: row => row.salaryperHour,
      sortable: true,
      cell: row => <span className="text-base text-gray-700">${row.salaryperHour.toFixed(2)}</span>
    },
    {
      name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Allowances</span>,
      selector: row => row.allowances,
      sortable: true,
      cell: row => <span className="text-base text-green-600">${row.allowances.toFixed(2)}</span>
    },
    {
      name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Deductions</span>,
      selector: row => row.deductions,
      sortable: true,
      cell: row => <span className="text-base text-red-600">-${row.deductions.toFixed(2)}</span>
    },
    {
      name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Total Hours</span>,
      selector: row => row.totalHours,
      sortable: true,
      cell: row => <span className="text-base text-gray-700">{row.totalHours.toFixed(1)} hrs</span>
    },
    {
      name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Total Salary</span>,
      selector: row => row.totalSalary,
      sortable: true,
      cell: row => <span className="text-base font-semibold text-gray-700">${row.totalSalary.toFixed(2)}</span>
    }
  ];
  // Month names array
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Fetch salary details
  const fetchSalaryDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/salary/salary-details/${id}?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.data) {
        setSalaryDetails(response.data.data);
      } else {
        setSalaryDetails(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salary details:", error);
      setSalaryDetails(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryDetails();
  }, [month, year]);

  // Custom styles for DataTable
  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    headRow: {
      style: {
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e2e8f0',
      },
    },
    headCells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
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
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
  };
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">
          Salary Details
        </h3>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-end items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold
                       focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              {monthNames.map((name, i) => (
                <option key={i+1} value={String(i+1).padStart(2, "0")}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={year}
              min="2000"
              max={now.getFullYear() + 5}
              onChange={e => setYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-28 text-sm font-semibold
                       focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <DataTable
            columns={columns}
            data={salaryDetails ? [salaryDetails] : []}
            customStyles={customStyles}
            pagination={false}
            highlightOnHover
            responsive
            progressPending={loading}
            progressComponent={
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent"></div>
              </div>
            }
            noDataComponent={
              <div className="text-center py-8 text-gray-500">
                No salary details available for the selected period
              </div>
            }
          />
        </div>
        </div>
    </div>
  );
};

export default SalaryDetails;