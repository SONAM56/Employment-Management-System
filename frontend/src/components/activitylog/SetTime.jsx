import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetTime = () => {
    const [startHour, setStartHour] = useState(10);
    const [endHour, setEndHour] = useState(17);
    const [currentConfig, setCurrentConfig] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/activity-log/config',
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
            const response = await axios.post('http://localhost:5000/api/activity-log/set-time', payload,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data);
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
        <div className="container mx-auto p-6 max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">Set Office Hours</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="startHour">
                        Start Hour (24-hour format)
                    </label>
                    <input
                        type="number"
                        id="startHour"
                        value={startHour}
                        onChange={(e) => setStartHour(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        min="0"
                        max="23"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="endHour">
                        End Hour (24-hour format)
                    </label>
                    <input
                        type="number"
                        id="endHour"
                        value={endHour}
                        onChange={(e) => setEndHour(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        min="0"
                        max="23"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-600 transition duration-300"
                >
                    Update Time
                </button>
            </form>
            {currentConfig && (
                <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Current Office Hours</h3>
                    <p className="text-gray-700">
                        <span className="font-semibold">Start Hour:</span> {currentConfig.startHour}:00
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">End Hour:</span> {currentConfig.endHour}:00
                    </p>
                </div>
            )}
        </div>
    );
};

export default SetTime;