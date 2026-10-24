const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

/* Reqire routes */
const authRouter = require('./routes/authRoutes');
const interviewRouter = require('./routes/interviewRoutes');



/*  */
app.use(cors({
    origin: ['http://localhost:5173', process.env.CLIENT_URL],
    credentials: true
}));




/* middleware to parse the data */
app.use(express.json());
app.use(express.urlencoded({extended : true}));
/* middle ware to read cookie */
app.use(cookieParser());
/* middleware to connect with frontend */
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true
}))




/* using routes*/
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);




module.exports = app;