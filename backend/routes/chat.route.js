import express from "express"
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router =express.Router();

router.route('/token').get(verifyJWT,getStreamToken);
export default router;