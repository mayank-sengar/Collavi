import express from 'express';
import { getRecommendedUsers, getMyFriends,sendFriendRequest,acceptFriendRequest,
    getFriendRequests,getOutgoingFriendRequests,rejectFriendRequest } from '../controllers/user.controller.js';

import { verifyJWT } from './../middlewares/authMiddleware.js';
const router = express.Router();

//protect all routes after this middleware
router.use(verifyJWT) 

router.route('/').get(getRecommendedUsers);
router.route('/friends').get(getMyFriends);
//id of sender(User)
router.route('/friend-request/:id').post(sendFriendRequest);
//id of friendRequest
router.route('/friend-request/:id/accept').put(acceptFriendRequest);
router.route('/friend-request/:id/reject').put(rejectFriendRequest);
router.route('/friend-requests').get(getFriendRequests);
router.route('/otgoing-friend-requests').get(getOutgoingFriendRequests);


export default router;
