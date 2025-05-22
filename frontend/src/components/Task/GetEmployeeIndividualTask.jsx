import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const ShowEmployeeIndividualTask = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusMap, setStatusMap] = useState({});
    const {baseUrl} = useAuth();
 
    useEffect(() => {
        fetchTasks();
    }, [id]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/employee/task/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setTasks(response.data.tasks);
                const map = {};
                response.data.tasks.forEach(task => {
                    map[task._id] = task.status;
                });
                setStatusMap(map);
            }
        } catch (error) {
            setError('Failed to fetch task details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await axios.patch(
                `${baseUrl}/api/employee/tasks/${taskId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                setStatusMap(prev => ({ ...prev, [taskId]: newStatus }));
                setTasks(prev =>
                    prev.map(task =>
                        task._id === taskId ? { ...task, status: newStatus } : task
                    )
                );
            }
        } catch (err) {
            console.error('Error updating task status:', err);
        }
    };

    const getStatusClass = (status) => {
        if (status === 'Completed') return 'bg-green-100 text-green-800';
        if (status === 'In Progress') return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="p-6 max-w-2xl mx-auto text-center text-gray-600">
                No tasks found
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Task List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-teal-600 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Title</th>
                            <th className="py-3 px-4 text-left">Description</th>
                            <th className="py-3 px-4 text-left">Assigned To</th>
                            <th className="py-3 px-4 text-left">Department</th>
                            <th className="py-3 px-4 text-left">Assigned Date</th>
                            <th className="py-3 px-4 text-left">Due Date</th>
                            <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr key={task._id || index} className="border-b hover:bg-gray-100">
                                <td className="py-3 px-4">{task.taskName}</td>
                                <td className="py-3 px-4 whitespace-pre-wrap">{task.taskDescription}</td>
                                <td className="py-3 px-4">{task.employeeName}</td>
                                <td className="py-3 px-4">{task.department}</td>
                                <td className="py-3 px-4">{new Date(task.assignDate).toLocaleDateString()}</td>
                                <td className="py-3 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                    <select
                                        value={statusMap[task._id]}
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        className={`px-2 py-1 rounded text-sm border ${getStatusClass(statusMap[task._id])}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowEmployeeIndividualTask;
