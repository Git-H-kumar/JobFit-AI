const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

/* Zaroori fix: Live cloud server (Render) for secure cookies*/
app.set('trust proxy', 1);

/* Reqire routes */
const authRouter = require('./routes/authRoutes');
const interviewRouter = require('./routes/interviewRoutes');

/* middleware to connect with frontend */
app.use(cors({
    origin: ['http://localhost:5173', process.env.CLIENT_URL],
    credentials: true
}));

/* middleware to parse the data */
app.use(express.json());
app.use(express.urlencoded({extended : true}));

/* middle ware to read cookie */
app.use(cookieParser());

/* using routes*/
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

module.exports = app;