const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/about', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/public/about.html'));
});

app.use(cors());

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use('/public', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

const server = require('http').Server(app);

const io = require('socket.io')(server);

server.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
});

//Users array to store the socket id
const users = {};

//Connection
io.on('connection', (socket) => {
    console.log('New client connected!');

    socket.emit('test', 'welcome');

    //chat-message event
    socket.on('chat-message', (data) => {
        //Broadcast the message to everyone except the sender
        socket.broadcast.emit('new-message', {message: data, name: users[socket.id]});

    })

    //New user event
    socket.on('new-user', (data) => {
        users[socket.id] = data;
        console.log('new user id: '+socket.id);

        socket.emit('user-list', users);
        socket.broadcast.emit('user-list', users);

        socket.broadcast.emit('user-connected', data);
    })
    
    //Disconnect
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit('user-list', users);
    })

})