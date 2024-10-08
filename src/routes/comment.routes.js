import express from 'express';
import * as comment from '##/src/controller/comment.controller.js';

const commentRoutes = express.Router();

commentRoutes.route('/create').post(comment.createComment);

export default commentRoutes;
