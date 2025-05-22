import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const AssignTask = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        employeeId: '',
        taskName: '',
        taskDescription: '',
        dueDate: ''
    });

    const {baseUrl} = useAuth();
    console.log(formData.employeeId)

    // Fetch employees for dropdown
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employee/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response.data)
                if (response.data.success) {
                    setEmployees(response.data.employees);
                }
            } catch (error) {
                setError('Failed to fetch employees');
            }
        };

        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${baseUrl}/api/employee/task/add`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                navigate('/admin-dashboard/employees');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to assign task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-teal-700 tracking-wide drop-shadow">
                    Assign New Task
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Employee
                        </label>
                        <select
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                     focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="">Choose an employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.userId.name} - {emp.department.dep_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Name
                        </label>
                        <input
                            type="text"
                            name="taskName"
                            value={formData.taskName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                     focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Enter task name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Description
                        </label>
                        <textarea
                            name="taskDescription"
                            value={formData.taskDescription}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                     focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Enter task description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                     focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin-dashboard/employees')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold
                                    hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2
                                    ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {loading && (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            )}
                            {loading ? 'Assigning...' : 'Assign Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignTask;