import express from "express"
import { verifyJWT } from "../middlewares/authMiddleware.js";
import router from "./user.route.js";

const router =express.Router();

router.route('/token').get(verifyJWT,getStreamToken);
export default router;