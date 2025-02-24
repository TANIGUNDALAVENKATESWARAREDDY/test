const jwt = require('jsonwebtoken');
const { instanceSocket } = require('../../utils/socket');

function authMiddleware(req,res,next){
    const token = req.cookies.token;
    // console.log('token: ',token);
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
        return res.status(401).json({ success: false, message: 'Unauthorized access, please login' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Use your JWT secret
        req.user = decoded; // Attach user info from token to the request
        next(); // Pass control to the next handler
    } catch (err) {
        console.log('Token verification failed:', err);
        res.status(403).json({ success: false, message: 'Forbidden, invalid token' });
    }
}

module.exports = {
    authMiddleware
}