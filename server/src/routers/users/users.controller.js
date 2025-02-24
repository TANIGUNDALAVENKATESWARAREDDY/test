const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const usersDatabase = require('../../models/users.model/users.mongo');
const {cookiesSameSite ,cookiesMaxAge} = require('../../utils/data');
const { instanceSocket } = require('../../utils/socket');

const generateToken = (user) =>{
    return jwt.sign(
        {role:user.role,username:user.username,changepassworddata:user.changepassworddata},
        process.env.JWT_TOKEN,//here the secrate key must store in the environment 
        {expiresIn:'5h'}//token expiration time
    );
};


async function userLoginController(req,res){ //user login controller
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {username , password} = req.body;
    try{
        const user = await usersDatabase.findOne({username});
        if(!user){
            return res.status(400).json({success:false,message:'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:'Invalid Credentials'});
        }

        const token = generateToken(user);
        // console.log('generating token ',token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Set to true in production with HTTPS
            maxAge: cookiesMaxAge, // 1 hour
            sameSite: cookiesSameSite // Allows cookies to be sent cross-origin
        });
        res.json({success:true,message:'login successful',user:user});
        
    }catch(err){
        console.log('getting error in users controller',err);
        res.status(500).json({success:false, message:'getting error in users controller'});
    }

}

async function checkAuthController(req,res){
    // console.log('cookies: ',req.cookies)
    const token = req.cookies.token;
    // console.log('token data',token);
    if(!token){
        const socketio = instanceSocket();
        if(socketio){//clearing all the rooms when user logouts
            socketio.rooms.forEach((room) => {
                if (room !== socketio.id) {
                    socketio.leave(room);
                }
            });
            console.log('cleared all rooms');
        }
        return res.status(401).json({success:false,message:'token not found or expired'});
    }
    try{
        const decoded =  jwt.verify(token,process.env.JWT_TOKEN);
        return res.json({success:true,message:'successfully verified',user:decoded});
    }catch(err){
        return res.status(403).json({success:false,message:'token not valid'});
    }
}

async function userLogoutController(req,res){
    try{
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Set to true in production with HTTPS
            // maxAge: cookiesMaxAge, // 1 hour
            sameSite: cookiesSameSite // Allows cookies to be sent cross-origin
        });
        const socketio = instanceSocket();
        if(socketio){//clearing all the rooms when user logouts
            socketio.rooms.forEach((room) => {
                if (room !== socketio.id) {
                    socketio.leave(room);
                }
            });
            console.log('cleared all rooms');
        }
        res.json({success:true,message:'Logged Out Successfully'});
    }
    catch(err){
        consolelog('getting an error while logout',err);
        res.json({success:false,message:'error while logout'});
    }
}



module.exports = {
    userLoginController,
    checkAuthController,
    userLogoutController
}