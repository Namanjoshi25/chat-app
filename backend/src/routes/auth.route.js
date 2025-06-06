import { Router } from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js'
const router = Router();


router.post("/signup",signup)

router.post("/login",login)
router.post("/logout",logout)

router.put("/updateprofile",protectRoute,upload.single('profilePic'),updateProfile)
router.get("/check",protectRoute,checkAuth)

export default router