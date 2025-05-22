import express from 'express'
import { changePassword, login,sendCodeToEmail,verfiyCode,verify} from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddlware.js'

const router = express.Router()

router.post('/login', login)
router.post('/forget-password/send-code', sendCodeToEmail)
router.post('/forget-password/verify', verfiyCode)
router.get('/verify', authMiddleware, verify)
router.post('/change-password', changePassword)

export default router;