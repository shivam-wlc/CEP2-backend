import express from 'express';
import * as unifiedRecord from '##/src/controller/unifiedRecord.controller.js';
const unifiedRecordRoute = express.Router();

unifiedRecordRoute.route('/getunifiedrecorddata/:userId').get(unifiedRecord.getUnifiedRecordData);
unifiedRecordRoute.route('/updateunifiedrecordstatus/:userId').patch(unifiedRecord.updateResumeStatus);
//admin routes
unifiedRecordRoute.route('/getallunifiedrecorddata').get(unifiedRecord.getAllUnifiedRecordData);
unifiedRecordRoute.route('/getunifiedrecorddataofuser/:unifiedId').get(unifiedRecord.getUnifiedRecordDataOfUser);


export default unifiedRecordRoute;
