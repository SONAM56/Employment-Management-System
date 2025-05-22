import express from 'express';
import Config from '../models/Config.js';
import ActivityLog from '../models/ActivityLog.js';
import moment from 'moment-timezone';
const router = express.Router();
import authMiddleware from '../middleware/authMiddlware.js';
// Endpoint to fetch activity logs
// router.get('/today',authMiddleware, async (req, res) => {
//     try {
//         // Get the start and end of the current day in Nepali Time (NST)
//         const startOfDay = moment().tz('Asia/Kathmandu').startOf('day').toDate();
//         const endOfDay = moment().tz('Asia/Kathmandu').endOf('day').toDate();

//         const logs = await ActivityLog.find({
//             dayOfLog: { $gte: startOfDay, $lte: endOfDay },
//         }).sort({ createdAt: -1 });
//         res.status(200).json(logs);
//     } catch (error) {
//         console.error('Error fetching activity logs:', error);
//         res.status(500).json({ message: 'Error fetching activity logs' });
//     }
// });

router.get('/today', authMiddleware, async (req, res) => {
    try {
        const startOfDay = moment().tz('Asia/Kathmandu').startOf('day').toDate();
        const endOfDay = moment().tz('Asia/Kathmandu').endOf('day').toDate();

        // Get endHour from config in database
        const config = await Config.findOne();
        if (!config) {
            return res.status(400).json({ message: 'Office hours not set in config.' });
        }
        const endHour = config.endHour;

        const now = moment().tz('Asia/Kathmandu');
        const endHourToday = now.clone().startOf('day').add(endHour, 'hours');

        const logs = await ActivityLog.find({
            dayOfLog: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ createdAt: -1 });

        // Only replace logoutTime if current time is after endHour
        const logsWithLogout = logs.map(log => {
            let logoutTime = log.logoutTime;
            if (
                !logoutTime &&
                log.loginTime &&
                now.isAfter(endHourToday)
            ) {
                // Set logoutTime to today's date at endHour
                logoutTime = now.clone().startOf('day').add(endHour, 'hours').toDate();
            }
            return { ...log.toObject(), logoutTime };
        });

        res.status(200).json(logsWithLogout);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Error fetching activity logs' });
    }
});

router.post('/set-time',authMiddleware, async (req, res) => {
    try {
        const { startHour, endHour } = req.body;

        if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23 || startHour >= endHour) {
            return res.status(400).json({ success: false, message: 'Invalid startHour or endHour' });
        }

        const config = await Config.findOneAndUpdate(
            {}, // Match any document (or create a new one if none exists)
            { startHour, endHour },
            { new: true, upsert: true } // Create a new document if none exists
        );


        res.status(200).json({ success: true, message: 'Office hours updated successfully', config });
    } catch (error) {
        console.error('Error updating office hours:', error);
        res.status(500).json({ success: false, message: 'Error updating office hours' });
    }
});


router.get('/config',authMiddleware, async (req, res) => {
    try {
        const config = await Config.findOne();
        if (!config) {
            return res.status(404).json({ success: false, message: 'No configuration found' });
        }
        res.status(200).json({ success: true, config });
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ success: false, message: 'Error fetching config' });
    }
});

// router.get('/filter',authMiddleware, async (req, res) => {
//     try {
//         const { date } = req.query;

//         // Parse the date and set the start and end of the day
//         const startOfDay = date
//             ? moment(date).tz('Asia/Kathmandu').startOf('day').toDate()
//             : moment().tz('Asia/Kathmandu').startOf('day').toDate();
//         const endOfDay = date
//             ? moment(date).tz('Asia/Kathmandu').endOf('day').toDate()
//             : moment().tz('Asia/Kathmandu').endOf('day').toDate();

//         const logs = await ActivityLog.find({
//             dayOfLog: { $gte: startOfDay, $lte: endOfDay },
//         }).sort({ createdAt: -1 });

//         res.status(200).json(logs);
//     } catch (error) {
//         console.error('Error fetching filtered activity logs:', error);
//         res.status(500).json({ message: 'Error fetching filtered activity logs' });
//     }
// });

router.get('/filter', authMiddleware, async (req, res) => {
    try {
        const { date } = req.query;
        const tz = 'Asia/Kathmandu';
        const day = date ? moment(date).tz(tz) : moment().tz(tz);
        const startOfDay = day.clone().startOf('day').toDate();
        const endOfDay = day.clone().endOf('day').toDate();

        // Get endHour from config in database
        const config = await Config.findOne();
        if (!config) {
            return res.status(400).json({ message: 'Office hours not set in config.' });
        }
        const endHour = config.endHour;

        // For the selected day, calculate endHour time
        const endHourOfDay = day.clone().startOf('day').add(endHour, 'hours');
        const now = moment().tz(tz);

        const logs = await ActivityLog.find({
            dayOfLog: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ createdAt: -1 });

        // Only replace logoutTime if current time is after endHour of that day
        const logsWithLogout = logs.map(log => {
            let logoutTime = log.logoutTime;
            if (
                !logoutTime &&
                log.loginTime &&
                now.isAfter(endHourOfDay)
            ) {
                logoutTime = endHourOfDay.toDate();
            }
            return { ...log.toObject(), logoutTime };
        });

        res.status(200).json(logsWithLogout);
    } catch (error) {
        console.error('Error fetching filtered activity logs:', error);
        res.status(500).json({ message: 'Error fetching filtered activity logs' });
    }
});
// router.get('/employee/:id',authMiddleware, async (req, res) => {
//     try {
//         const { id } =  req.params;

//         const logs = await ActivityLog.find({ userId: id }).sort({ dayOfLog: -1 });
//         res.status(200).json(logs);
//     } catch (error) {
//         console.error('Error fetching attendance logs for employee:', error);
//         res.status(500).json({ message: 'Error fetching attendance logs' });
//     }
// });
router.get('/employee/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { month, year } = req.query;

        let filter = { userId: id };

        if (month && year) {
            // month: "01".."12", year: "2024"
            const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
            // Calculate the first day of the next month
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            filter.dayOfLog = { $gte: start, $lt: end };
        }

        const logs = await ActivityLog.find(filter).sort({ dayOfLog: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching attendance logs for employee:', error);
        res.status(500).json({ message: 'Error fetching attendance logs' });
    }
});

export default router;