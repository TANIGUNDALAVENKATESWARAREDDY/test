const express = require('express');
const {check} = require('express-validator');
const { userLoginController, checkAuthController, userLogoutController } = require('./users.controller');
const { authMiddleware } = require('../../middlewares/authentication/authMiddleware');
const usersRouter = express.Router();

usersRouter.post('/login',[check('username').exists(),check('password').exists()],userLoginController);
// usersRouter.post('/login',userLoginController);
usersRouter.get('/checkauth',checkAuthController);
usersRouter.post('/logout',authMiddleware,userLogoutController);
module.exports = usersRouter;