import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave, deleteLeave } from '../controllers/leaveController.js';

const router = express.Router()

router.post('/add', authMiddleware,  addLeave)
router.get('/:id', authMiddleware,  getLeave)
router.get('/detail/:id', authMiddleware,  getLeaveDetail)
router.get('/', authMiddleware, getLeaves)
router.put('/:id', authMiddleware, updateLeave)
router.delete('/:id', authMiddleware, deleteLeave)

export default router