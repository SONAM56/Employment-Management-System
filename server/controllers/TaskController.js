import Task from '../models/Task.js';
import Employee from '../models/Employee.js';

// Create new task
const createTask = async (req, res) => {
    try {
        const { employeeId, taskName, taskDescription, dueDate } = req.body;
        console.log("Show data",req.body)
        // Find employee to get name and department
        const employee = await Employee.findById(employeeId)
            .populate('userId')
            .populate('department');
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: "Employee not found"
            });
        }

        const task = new Task({
            employeeId,
            employeeName: employee.userId.name,
            department: employee.department.dep_name,
            taskName,
            taskDescription,
            dueDate,
            assignDate: new Date()
        });

        await task.save();

        return res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        console.log("hello")
        const tasks = await Task.find({}).sort({ assignDate: -1 });
        console.log(tasks)
        
        return res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get tasks for specific employee
const getEmployeeTasks = async (req, res) => {
    try {
        const { employeeId } = req.params;
        console.log(employeeId)
        const tasks = await Task.find({ employeeId:employeeId }).sort({ assignDate: -1 });
        console.log(tasks)
        return res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get single task details
const getTaskDetail = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const task = await Task.findById({
            employeeId:employeeId
        });
        
        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export {
    createTask,
    getAllTasks,
    getEmployeeTasks,
    getTaskDetail,
    updateTaskStatus,
    deleteTask
};