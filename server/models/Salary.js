import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    salaryperHour: { type: Number, required: true},
    allowances: { type: Number, default: 0},
    deductions: { type: Number, default: 0},   
    assignDate: { type: Date, required: true},
}, { timestamps: true });

const Salary = mongoose.model('Salary', salarySchema);
export default Salary