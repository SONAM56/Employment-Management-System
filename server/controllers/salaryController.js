import moment from "moment";
import Salary from "../models/Salary.js"
import ActivityLog from "../models/ActivityLog.js"
import Employee from "../models/Employee.js"
import SalaryHistory from "../models/SalaryHistory.js";

const addSalary = async (req, res) => {
    try {
        const { employeeId, salaryperHour, allowances, deductions, assignDate } = req.body;

        // Check if a salary record already exists for this employee 
        let existingSalary = await Salary.findOne({ employeeId});

        let newSalary;
        if (existingSalary) {
            // Update the existing salary record
            existingSalary.salaryperHour = salaryperHour;
            existingSalary.allowances = allowances;
            existingSalary.deductions = deductions;
            existingSalary.assignDate = assignDate;
            newSalary = await existingSalary.save();
        } else {
            // Create a new salary record
            newSalary = await Salary.create({
                employeeId,
                salaryperHour,
                allowances,
                deductions,
                assignDate
            });
        }

        return res.status(200).json({ success: true, message: "Salary added/updated successfully", salary: newSalary });
    } catch (error) {
        return res.status(500).json({ success: false, error: "salary add server error" });
    }
}

const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Salary.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Salary record not found" });
        }
        return res.status(200).json({ success: true, message: "Salary record deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Salary delete server error" });
    }
};
const getSalaries = async (req, res) => {
    try {
        // Populate employeeId (Employee), then populate userId (User) to get name
        const salaries = await Salary.find()
            .populate({
                path: 'employeeId',
                populate: {
                    path: 'userId',
                    select: 'name'
                }
            });

        // Map to include employeeName directly for frontend
        const salariesWithName = salaries.map(sal => ({
            ...sal.toObject(),
            employeeName: sal.employeeId && sal.employeeId.userId ? sal.employeeId.userId.name : ""
        }));

        return res.status(200).json({ success: true, salaries: salariesWithName });
    } catch (error) {
        return res.status(500).json({ success: false, error: "get department server error" });
    }
}
const getSalaryDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, year } = req.query;

        // Fetch employee details if needed
        const employee = await Employee.findOne({ userId: id });
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Fetch salary details
        const salary = await Salary.findOne({ employeeId: employee._id });
        if (!salary) {
            return res.status(404).json({ success: false, message: "Salary details not found" });
        }

        // Build date filter for activity logs
        let activityLogFilter = { userId: id };
        // let periodMonth = month || (new Date().getMonth() + 1).toString().padStart(2, "0");
        // let periodYear = year || new Date().getFullYear().toString();
        if (month && year) {
            // Filter logs where loginTime is in the selected month/year
            const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
            const endDate = moment(startDate).endOf('month').toDate();
            activityLogFilter.loginTime = { $gte: startDate, $lte: endDate };
        } else if (year) {
            const startDate = moment(`${year}-01-01`).startOf('year').toDate();
            const endDate = moment(startDate).endOf('year').toDate();
            activityLogFilter.loginTime = { $gte: startDate, $lte: endDate };
        }

        // Fetch activity logs
        const activityLogs = await ActivityLog.find(activityLogFilter);
        if (!activityLogs || activityLogs.length === 0) {
            return res.status(404).json({ success: false, message: "No activity logs found" });
        }

        // Get month and year from the first activity log (or use a different logic as needed)
        let periodMonth, periodYear;
        if (activityLogs.length > 0 && activityLogs[0].loginTime) {
            const logDate = new Date(activityLogs[0].loginTime);
            periodMonth = String(logDate.getMonth() + 1).padStart(2, "0");
            periodYear = String(logDate.getFullYear());
        } else {
            // fallback to current month/year if no logs
            periodMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
            periodYear = new Date().getFullYear().toString();
        }

        // Calculate total hours worked
        let totalHours = 0;
        activityLogs.forEach(log => {
            if (log.loginTime && log.logoutTime) {
                const hoursWorked = moment(log.logoutTime).diff(moment(log.loginTime), 'hours', true);
                if (hoursWorked > 0) {
                    totalHours += hoursWorked;
                }
            }
        });

        // Calculate total salary
        const totalSalary = (salary.salaryperHour * totalHours) + salary.allowances - salary.deductions;
        
        // If already exists for this employee/month/year, update it, else create new
        await SalaryHistory.findOneAndUpdate(
            { employeeId: employee._id, periodMonth, periodYear },
            {
                salaryperHour: salary.salaryperHour,
                allowances: salary.allowances,
                deductions: salary.deductions,
                totalHours,
                totalSalary: totalSalary || 0,
                calculatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            data: {
                salaryperHour: salary.salaryperHour,
                allowances: salary.allowances,
                deductions: salary.deductions,
                totalHours,
                totalSalary: totalSalary || 0 
            }
        });
    } catch (error) {
        console.error("Error in getSalaryDetails:", error);
        return res.status(500).json({ success: false, error: "SalaryDetails server cannot work" });
    }
};

const getSalaryHistory = async (req, res) => {
    try {
        const { id } = req.params; // changed from employeeId to id
        const { month, year } = req.query;
        let filter = { employeeId: id }; // use id as the employeeId

        if (month) filter.periodMonth = month;
        if (year) filter.periodYear = year;

        const history = await SalaryHistory.find(filter).sort({ calculatedAt: -1 });
        return res.status(200).json({ success: true, history });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Salary history fetch error" });
    }
};


export {addSalary, getSalaries, deleteSalary, getSalaryDetails, getSalaryHistory}