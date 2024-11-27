import express from 'express';
import * as followers from '##/src/controller/followers.controller.js';
const followersRoute = express.Router();

// Toggle follow/unfollow
followersRoute.route('/follow/:targetUserId').post(followers.toggleFollow);

// Get follower count
followersRoute.route('/count/:userId').get(followers.getFollowerCount);

// Get following count
followersRoute.route('/following-count/:userId').get(followers.getFollowingCount);

// Check if following
followersRoute.route('/check-follow/:targetUserId/:userId').get(followers.checkIfFollowing);

export default followersRoute;
