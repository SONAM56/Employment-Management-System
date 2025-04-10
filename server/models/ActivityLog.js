import mongoose from 'mongoose';
const activityLogSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    loginTime: { type: Date },
    logoutTime: { type: Date },
    dayOfLog: { type: Date, default: Date.now },
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog; 