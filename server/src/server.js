const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const {initSocket} = require('./utils/socket');
require('dotenv').config();
const PORT = process.env.PORT || 8080;;
const MONGO_URL=process.env.MONGODB_URL;
const server = http.createServer(app);
const io = initSocket(server);

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection is ready!');
});
mongoose.connection.on('error',(err)=>{
    console.error(err);
});

// async function startServer(){
//     await mongoose.connect(MONGO_URL);
//     server.listen(PORT,()=>{
//         console.log(`listening on port ${PORT}`);
//     });
// }

async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');
        
        // Start the HTTP server
        server.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
}
startServer();

