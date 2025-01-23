import express from 'express';
import * as unifiedRecord from '##/src/controller/unifiedRecord.controller.js';
import { upload } from '##/src/config/lib/S3.js';
const unifiedRecordRoute = express.Router();

unifiedRecordRoute.route('/getunifiedrecorddata/:userId').get(unifiedRecord.getUnifiedRecordData);
unifiedRecordRoute
  .route('/updateunifiedrecordstatus/:userId')
  .patch(unifiedRecord.updateResumeStatus);

unifiedRecordRoute
  .route('/savecdrtostorage/:userId')
  .post(upload.single('cdr'), unifiedRecord.saveCdrToStorgae);
//admin routes
unifiedRecordRoute.route('/getallunifiedrecorddata').get(unifiedRecord.getAllUnifiedRecordData);
unifiedRecordRoute
  .route('/getunifiedrecorddataofuser/:unifiedId')
  .get(unifiedRecord.getUnifiedRecordDataOfUser);

export default unifiedRecordRoute;
