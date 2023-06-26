const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const randomWords = require('random-english-words');

// console.log(randomWords({minCount: 20 }));

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const Users = {};
const rooms = {};

io.on('connection', (socket) => {
    let socketId = socket.id;
    console.log(`User connected to socket ${socketId}`);

    socket.on('createRoom', (data) => {
        if (rooms[data.roomName]) {
            io.to(socketId).emit('errRoom', 'bunday xona mavjun');
        } else {
            socket.join(data.roomName);
            Users[socketId] = {
                x: 0,
                name: data.name,
                roomName: data.roomName,
            };
            rooms[data.roomName] = {
                admin: socketId,
                talk: randomWords({ minCount: 10 }),
                // talk: `Balki tugatib ishinga qaytarsan`,
            };

            io.to(socketId).emit('RoomData', {
                ...rooms[data.roomName]
            });
        }
    });

    socket.on('joinRoom', (data) => {
        if (rooms[data.roomName]) {
            console.log('Joined room');
            socket.join(data.roomName);
            Users[socketId] = {
                x: 0,
                name: data.name,
                roomName: data.roomName,
            };
            let users = {};
            for (let key in Users) {
                if (Users[key].roomName == data.roomName) {
                    users[key] = {
                        id: key,
                        name: Users[key].name
                    }
                }
            }
            io.to(socketId).emit('allUser', { Users: users, talk: rooms[data.roomName].talk, id: socketId, });
            io.to(data.roomName).emit('newUser', { name: data.name, id: socketId })
        } else {
            io.to(socketId).emit('errRoom', 'Xona topilmadi');
        }
    });

    socket.on('startGame', (data) => {
        socket.broadcast.emit('startRace', true)
        io.to(socketId).emit('startRace', true)
    })

    socket.on('moveUser', (data) => {
        Users[data.id].x = data.i;
        socket.broadcast.emit('MoveUser', {
            id: socketId,
            i: Users[data.id].x,
            name: Users[data.id].name
        })
    })

    socket.on('disconnect', () => {
        if (Users[socketId]) {
            const roomName = Users[socketId].roomName;
            socket.leave(roomName);
            io.to(roomName).emit('leaveUser', socketId);
            delete Users[socketId];
        }
    });

    // socket.on('disconnect', (data) => {
    //     delete Users[socketId]
    //     socket.broadcast.emit('Disconnected', socketId)
    // })
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port} http://localhost:${port}`);
});
