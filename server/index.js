const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const { v4: uuidv4 } = require('uuid');

app.get('/', (req, res) => {
  res.send('hello');
});

let sockets = {}; // socketId: { email, name, roomId, role }
let rooms = {}; // roomId: [{ email, name, socketId, role },...]

io.on('connection', (socket) => {
  socket.on('getrooms', (data, callback) => {
    callback(uuidv4());
  });

  // user joins the room
  socket.on('join', ({ currentUser, roomId }, callback) => {
    console.log(currentUser.email, currentUser.displayName, roomId, socket.id);

    const roomObj = {
      email: currentUser.email,
      name: currentUser.displayName,
      socketId: socket.id,
      role: 'student',
    };

    if (roomId in rooms) rooms[roomId].push(roomObj);
    else {
      rooms[roomId] = [roomObj];
    }

    const socketObj = {
      email: currentUser.email,
      name: currentUser.displayName,
      roomId,
      role: 'student',
    };

    sockets[socket.id] = socketObj;

    socket.join(roomId);

    io.to(roomId).emit(
      'getParticipants',
      rooms[roomId].filter((user) => user.socketId !== undefined)
    );

    socket.emit('message', {
      user: 'Bot',
      to: 'You',
      text: `Hey ${currentUser.displayName}`,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
    });

    socket.broadcast.to(roomId).emit('message', {
      user: 'Bot',
      to: 'Everyone',
      text: `${currentUser.displayName} just joined the room`,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
    });

    callback();
  });

  // a message is sent over chat
  socket.on('sendMessage', (data, callback) => {
    const socketUser = sockets[socket.id];
    if (socketUser) {
      let messageObj = {
        text: data.message,
        time: data.time,
      };

      if (data.receiver === '') {
        // public message...
        messageObj.to = 'Everyone';
        socket.to(socketUser.roomId).emit('message', {
          user: socketUser.name,
          ...messageObj,
        });
        socket.emit('message', {
          user: 'You',
          ...messageObj,
        });
      } else {
        // private message...
        io.to(data.receiver).emit('message', {
          user: socketUser.name,
          to: 'You',
          ...messageObj,
        });
        socket.emit('message', {
          user: 'You',
          to: sockets[data.receiver].name,
          ...messageObj,
        });
      }
    }
    callback();
  });

  // socket gets disconnected
  socket.on('disconnect', () => {
    const socketUser = sockets[socket.id];
    if (socketUser) {
      socket.broadcast.to(socketUser.roomId).emit('message', {
        user: 'Bot',
        to: 'Everyone',
        text: `${socketUser.name} just left`,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
      });

      rooms[socketUser.roomId].map((user) => {
        if (user.socketId === socket.id) delete user.socketId;
      });

      io.to(socketUser.roomId).emit(
        'getParticipants',
        rooms[socketUser.roomId].filter((user) => user.socketId !== undefined)
      );

      delete sockets[socket.id];
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
