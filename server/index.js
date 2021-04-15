const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const { v4: uuidv4 } = require('uuid');

app.get('/', (req, res) => {
  res.send('hello');
});

const users = [];

const getUser = (id) => users.find((user) => user.id === id);

io.on('connection', (socket) => {
  console.log('connection made');

  socket.on('getrooms', (data, callback) => {
    console.log(data);
    callback(uuidv4());
  });

  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const user = { id: socket.id, name: name, room: room };
    users.push(user);

    console.log(users);

    socket.join(user.room);

    socket.emit('message', {
      user: 'Bot',
      text: `Hey ${user.name}`,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
    });

    socket.broadcast.to(user.room).emit('message', {
      user: 'Bot',
      text: `${user.name} just joined the room`,
      time: new Date().getHours() + ':' + new Date().getMinutes(),
    });

    callback();
  });

  socket.on('sendMessage', (data, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: user.name,
        text: data.message,
        time: data.time,
      });
    }
    callback();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
