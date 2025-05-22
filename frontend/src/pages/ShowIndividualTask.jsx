import React, { useState, useEffect } from 'react';
import { useActionData, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const ShowIndividualTask = () => {
    const { id } = useParams(); 
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {baseUrl} = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/employee/task/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.success) {
                    setTasks(response.data.tasks);
                }
            } catch (error) {
                setError('Failed to fetch task details');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [id]);

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
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                                        ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                          task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'}`}>
                                        {task.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowIndividualTask;
