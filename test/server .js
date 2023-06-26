const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const users = {}; // Changed variable name to lowercase 'users'

io.on('connection', (socket) => {
    let socketId = socket.id;

    // Emit the updated users object to all connected clients
    // socket.on('message', (message) => {
    //     console.log(message);
    //     socket.broadcast.emit('sendMessage', message);
    //     // broadcast
    // })

    users[socketId] = {
        x: 0
    };
    io.to(socketId).emit('AllUser', users);
    socket.broadcast.emit('newUser', socketId);

    socket.on('disconnect', () => {
        delete users[socketId];
        io.emit('updateUsers', users);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port} http://localhost:${port}`);
});
