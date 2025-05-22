import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js'
import { addEmployee, upload, getEmployees, getEmployee, updateEmployee , fetchEmployeesByDepId, getEmployeeByUserId} from '../controllers/employeeController.js';
import {
    createTask,
    getAllTasks,
    getEmployeeTasks,
    getTaskDetail,
    updateTaskStatus,
    deleteTask
} from '../controllers/TaskController.js';


const router = express.Router()

router.get('/', authMiddleware, getEmployees)
router.post('/add', authMiddleware, upload.single('image'), addEmployee)
router.get('/:id', authMiddleware, getEmployee)
router.get('/user/:userId', authMiddleware, getEmployeeByUserId)
router.put('/:id', authMiddleware, updateEmployee)
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)


router.post('/task/add', authMiddleware, createTask);
router.get('/task/get', authMiddleware, getAllTasks);

// Get tasks for specific employee
router.get('/task/:employeeId', authMiddleware, getEmployeeTasks);

// Get single task details
router.get('/task/detail/:employeeId', authMiddleware, getTaskDetail);

// Update task status
router.patch('/tasks/:taskId/status', authMiddleware, updateTaskStatus);

// Delete task
router.delete('/task/:taskId', authMiddleware, deleteTask);


export default router