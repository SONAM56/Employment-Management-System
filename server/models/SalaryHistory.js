import mongoose from "mongoose";
const { Schema } = mongoose;

const salaryHistorySchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    salaryperHour: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    totalHours: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
    periodMonth: { type: String, required: true }, // e.g. "04"
    periodYear: { type: String, required: true },  // e.g. "2025"
    calculatedAt: { type: Date, default: Date.now }
});

const SalaryHistory = mongoose.model("SalaryHistory", salaryHistorySchema);
export default SalaryHistory;