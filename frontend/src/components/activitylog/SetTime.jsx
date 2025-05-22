import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const SetTime = () => {
    const [startHour, setStartHour] = useState(10);
    const [endHour, setEndHour] = useState(17);
    const [currentConfig, setCurrentConfig] = useState(null);
    const navigate = useNavigate();
    const {baseUrl} = useAuth();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/activity-log/config`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (response.data.success) {
                    setCurrentConfig(response.data.config);
                }
            } catch (error) {
                console.error('Error fetching current config:', error);
            }
        };
        fetchConfig();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            startHour: parseInt(startHour, 10),
            endHour: parseInt(endHour, 10),
        }
        try {
            const response = await axios.post(`${baseUrl}/api/activity-log/set-time`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.data.success) {
                alert('Time updated successfully!');
                navigate('/admin-dashboard/activitylog/view');
            }
        } catch (error) {
            console.error('Error updating time:', error);
            alert('Failed to update time. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-teal-700 tracking-wide drop-shadow">Set Office Hours</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="startHour">
                            Start Hour <span className="text-xs text-gray-500">(24-hour format)</span>
                        </label>
                        <input
                            type="number"
                            id="startHour"
                            value={startHour}
                            onChange={(e) => setStartHour(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            min="0"
                            max="23"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="endHour">
                            End Hour <span className="text-xs text-gray-500">(24-hour format)</span>
                        </label>
                        <input
                            type="number"
                            id="endHour"
                            value={endHour}
                            onChange={(e) => setEndHour(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            min="0"
                            max="23"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold shadow hover:bg-teal-700 transition duration-200"
                >
                    Update Time
                </button>
            </form>
            {currentConfig && (
                <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow text-center border border-gray-200">
                    <h3 className="text-xl font-bold text-teal-700 mb-2">Current Office Hours</h3>
                    <div className="flex justify-center gap-10 text-lg">
                        <p className="text-gray-700">
                            <span className="font-semibold">Start:</span> {currentConfig.startHour}:00
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">End:</span> {currentConfig.endHour}:00
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetTime;