const {Router} = require('express');
const authRouter = Router();
/* require controllers */
const {registerUser, loginUser, logoutUser,getUser} = require('../controllers/auth-controller');
const {authUser} = require('../middlewares/authMiddleware');


/* controllers */
authRouter.post('/register', registerUser);
authRouter.post('/login',loginUser);
authRouter.get('/logout',logoutUser);
authRouter.get('/get-me',authUser,getUser);




module.exports = authRouter;