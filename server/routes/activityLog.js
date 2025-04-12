import express from 'express';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// Endpoint to fetch activity logs
router.get('/', async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Error fetching activity logs' });
    }
});

export default router;