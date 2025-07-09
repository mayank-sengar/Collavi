import express from 'express';
import {registerUser,loginUser,refreshAccessToken,logoutUser,onBoardUser,userDetails} from "../controllers/auth.controllers.js"
import { verifyJWT } from './../middlewares/authMiddleware.js';
const router=express.Router();

router.route('/register').post(registerUser)
router.route('/login').post( loginUser)
router.route('/refresh-token').post(verifyJWT,refreshAccessToken)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/onboard').post(verifyJWT,onBoardUser)
router.route('/me').get(verifyJWT,userDetails)
export default router;