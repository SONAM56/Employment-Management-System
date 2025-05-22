import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js'
import { addSalary, getSalaries, deleteSalary,getSalaryDetails,getSalaryHistory} from '../controllers/salaryController.js';
const router = express.Router()

router.post('/add', authMiddleware, addSalary)
router.get('/', authMiddleware, getSalaries)
router.get("/salary-details/:id", getSalaryDetails);
router.delete("/:id", deleteSalary);
router.get('/salary-history/:id', getSalaryHistory);
export default router