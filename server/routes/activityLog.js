import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import moment from 'moment-timezone';
const router = express.Router();

// Endpoint to fetch activity logs
router.get('/today', async (req, res) => {
    try {
        // Get the start and end of the current day in Nepali Time (NST)
        const startOfDay = moment().tz('Asia/Kathmandu').startOf('day').toDate();
        const endOfDay = moment().tz('Asia/Kathmandu').endOf('day').toDate();

        const logs = await ActivityLog.find({
            dayOfLog: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Error fetching activity logs' });
    }
});

export default router;