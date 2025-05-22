import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const SalaryHistoryList = () => { 
  const [history, setHistory] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const { id } = useParams();
  const {baseUrl} =useAuth();

  const fetchHistory = async () => {
    let url = `${baseUrl}/api/salary/salary-history/${id}`;
    const params = [];
    if (month) params.push(`month=${month}`);
    if (year) params.push(`year=${year}`);
    if (params.length) url += "?" + params.join("&");

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setHistory(res.data.history || []);
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="overflow-x-auto p-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Salary History</h2>
      </div>
      <div className="flex justify-end items-center gap-2 mb-6">
        <select
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">Month</option>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={String(i+1).padStart(2, "0")}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year"
          value={year}
          min="2000"
          max={new Date().getFullYear()}
          onChange={e => setYear(e.target.value)}
          className="border px-3 py-1 rounded w-24"
        />
        <button
          onClick={fetchHistory}
          className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700"
        >
          Filter
        </button>
      </div>
      <div className="mt-6">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
            <tr>
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3">Year</th>
              <th className="px-6 py-3">Salary/Hour</th>
              <th className="px-6 py-3">Allowances</th>
              <th className="px-6 py-3">Deductions</th>
              <th className="px-6 py-3">Total Hours</th>
              <th className="px-6 py-3">Total Salary</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">No records found.</td>
              </tr>
            ) : history.map(h => (
              <tr key={h._id} className=" border-b bg-slate-600 border-gray-700 text-black">
                <td className="px-6 py-3">{h.periodMonth}</td>
                <td className="px-6 py-3">{h.periodYear}</td>
                <td className="px-6 py-3">{h.salaryperHour}</td>
                <td className="px-6 py-3">{h.allowances}</td>
                <td className="px-6 py-3">{h.deductions}</td>
                <td className="px-6 py-3">{h.totalHours}</td>
                <td className="px-6 py-3">{h.totalSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryHistoryList;