const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const { v4: uuidv4 } = require('uuid');

app.get('/', (req, res) => {
  res.send('hello');
});

var users = [];

const getUser = (id) => users.find((user) => user.id === id);

io.on('connection', (socket) => {
  socket.on('getrooms', (data, callback) => {
    callback(uuidv4());
  });

  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const user = { id: socket.id, name: name, room: room };
    users.push(user);

    socket.join(user.room);

    io.to(room).emit(
      'newParticipant',
      users.filter((userObj) => userObj.room === user.room)
    );

    socket.emit('message', {
      user: 'Bot',
      to: 'You',
      text: `Hey ${user.name}`,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
    });

    socket.broadcast.to(user.room).emit('message', {
      user: 'Bot',
      to: 'Everyone',
      text: `${user.name} just joined the room`,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
    });

    callback();
  });

  socket.on('sendMessage', (data, callback) => {
    const user = getUser(socket.id);
    if (user) {
      let messageObj = {
        text: data.message,
        time: data.time,
      };
      console.log('receiver on server: ', data.receiver);
      if (data.receiver === '') {
        messageObj.to = 'Everyone';
        console.log('here', messageObj);
        socket.to(user.room).emit('message', {
          user: user.name,
          ...messageObj,
        });
        socket.emit('message', {
          user: 'You',
          ...messageObj,
        });
      } else {
        io.to(data.receiver).emit('message', {
          user: user.name,
          to: 'You',
          ...messageObj,
        });
        socket.emit('message', {
          user: 'You',
          to: getUser(data.receiver).name,
          ...messageObj,
        });
      }
    }
    callback();
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((user) => user.id === socket.id);
    if (users[index]) {
      console.log(users[index]);
      socket.broadcast.to(users[index].room).emit('message', {
        user: 'Bot',
        text: `${users[index].name} just left`,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
      });
    }
    users = users.filter((user) => user.id !== socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
