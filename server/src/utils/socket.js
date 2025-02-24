const {Server} = require('socket.io');
let io;
let socketio;

function initSocket(server){
    io = new Server(server,{
        cors: {
          origin: '*', // Replace with your client URL
          methods: ['GET', 'POST','PUT'], // Allowed methods
          credentials: true // If you need to include cookies or authentication headers
        }
      });

    io.on('connection',(socket)=>{
        console.log('A user connected');
        socketio = socket;

        socket.on("joinRoom",(userId)=>{//successfully joining the room
            const rooms = Array.from(socket.rooms);
            if(!rooms.includes(userId)){
                socket.join(userId);
                console.log('successfully joined the room');
            }
        });

        // socket.on("logout",(data)=>{
        //     console.log(`${data}`);
        //     socket.rooms.forEach((room) => {
        //         if (room !== socket.id) { // Avoid leaving the socket's own ID room
        //             socket.leave(room);
        //         }
        //     });
        // });

        socket.on('disconnect',()=>{
            console.log('user disconnected');
        });
    });

    return io;
}

function getSocketIO(){
    if(!io){
        throw new Error('Socket.io is not initialized!!');
    }
    return io;
}

function instanceSocket(){
    if(socketio){
        return socketio;
    }
    return null;
}

module.exports = {initSocket,getSocketIO , instanceSocket};