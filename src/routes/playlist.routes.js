import express from 'express';
import * as playList from '##/src/controller/playlist.controller.js';
const playlistRoute = express.Router();

playlistRoute.route('/createplaylist').post(playList.createPlaylist); //    const { playlistName, userId } = req.body;
playlistRoute.route('/deleteplaylist/:playlistId').delete(playList.deletePlaylist);
playlistRoute.route('/addvideotoplaylist').post(playList.addVideoToPlaylist); //    const { playlistId, videoId } = req.body;
playlistRoute.route('/removevideofromplaylist').post(playList.removeVideoFromPlaylist);
playlistRoute.route('/getuserplaylist/:userId').get(playList.getUserPlaylist);
playlistRoute.route('/movevideo').post(playList.moveVideoToDifferentPlaylist);

export default playlistRoute;
