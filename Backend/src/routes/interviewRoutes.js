const express = require('express');
const interviewRouter = express.Router();

const {authUser} = require('../middlewares/authMiddleware');
const {generateInterviewController, getInterviewController} = require('../controllers/interview-controller');
const upload = require('../middlewares/fileMiddleware');


interviewRouter.post('/',authUser,upload.single('resume'),generateInterviewController)
interviewRouter.get('/report/:interviewId',authUser,getInterviewController)





module.exports = interviewRouter;