const mongoose = require('mongoose');


/* technical questions sub-schema */
const technicalQuestionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: [true, "technical question is required"] 
    },
    intention: { 
        type: String, 
        required: [true, "intention is required"] 
    },
    answer: { 
        type: String, 
        required: [true, "answer is required"] 
    }
}, { _id: false });

/* behavioral questions sub-schema */
const behavioralQuestionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: [true, "technical question is required"] 
    },
    intention: { 
        type: String, 
        required: [true, "intention is required"] 
    },
    answer: { 
        type: String, 
        required: [true, "answer is required"] 
    }
}, { _id: false });


/* skillgaps sub-schema */
const skillGapSchema = new mongoose.Schema({
    skill: { 
        type: String, 
        required: [true, "skill is required"] 
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        lowercase: true // Automatically converts "High"/"MEDIUM" to lowercase
    }
}, { _id: false });

/* preprationPlan sub-schema */
const preprationPlanSchema = new mongoose.Schema({
    day: { 
        type: Number, 
        required: [true, "Day is required"] 
    },
    focus: { 
        type: String, 
        required: [true, 'focus is required'] 
    },
    tasks: [{ 
        type: String, 
        required: [true, "task is required"] }
    ]
}, { _id: false });


/* main schema */
const interviewSchema = new mongoose.Schema({
    jobDescription: { 
        type: String, 
        required: [true, "job description is required"]
    },
    resume: { 
        type: String 
    },
    selfDescription: { 
        type: String 
    },
    matchScore: { 
        type: Number, min: 0, max: 100 
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preprationPlan: [preprationPlanSchema],
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users' 
    }
}, { timestamps: true });

module.exports = mongoose.model("intervieReport", interviewSchema);