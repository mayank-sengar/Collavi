import express from "express"
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { sendMessage,getMessage,getFriendById } from "../controllers/chat.controller.js";


const router =express.Router();

// router.route('/token').get(verifyJWT,getStreamToken);

router.route('/send/:id').post(verifyJWT,sendMessage);
router.route('/get/:id').get(verifyJWT,getMessage);
router.route('/friend-details/:id').get(verifyJWT, getFriendById); 
export default router;