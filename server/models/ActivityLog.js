import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const activityLogSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName: { type: String, required: true },
    loginTime: { type: Date },
    logoutTime: { type: Date },
    dayOfLog: { type: Date, default: Date.now },
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog; 