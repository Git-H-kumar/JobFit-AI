const pdfParse = require('pdf-parse');
const generateInterviewReport = require('../services/ai-service');
const interviewModel = require('../models/interview-model');

module.exports.generateInterviewController = async function(req,res){

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const {selfDescription,jobDescription}= req.body;

    const AiInterviewReport = await generateInterviewReport({
        resume : resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewModel.create({
        user : req.user.id,
        resume : resumeContent.text,
        selfDescription,
        jobDescription,
        ...AiInterviewReport
    })

    res.status(201).json({
        message:"Interview Report generated successfully",
        interviewReport
    })
}

/* fetch interview report */
module.exports.getInterviewController = async function(req,res){
    if (!require('mongoose').isValidObjectId(req.params.interviewId)) {
        return res.status(400).json({ message: 'Invalid interview report ID' })
    }

    const interviewReport = await interviewModel.findOne({
        _id: req.params.interviewId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found' })
    }

    res.status(200).json({
        message: 'Interview report fetched successfully',
        interviewReport
    })
}
