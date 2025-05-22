import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
    startHour: { type: Number, required: true, default: 10 }, // Default to 10:00 AM
    endHour: { type: Number, required: true, default: 17 },   // Default to 5:00 PM
}, { timestamps: true });

const Config = mongoose.model('Config', configSchema);
export default Config;