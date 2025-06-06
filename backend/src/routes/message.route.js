import  { Router } from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsers, sendMessage } from '../controllers/message.controller.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

router.get("/users",protectRoute,getUsers)
router.get("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,upload.single('image'),sendMessage)



export default router