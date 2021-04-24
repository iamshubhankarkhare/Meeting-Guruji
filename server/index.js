const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());
app.get('/', (req, res) => {
  res.send('hello');
});

let sockets = {}; // socketId: { email, name, roomId, role }
let rooms = {}; // roomId: [{ email, name, sockets: [socketId...], primaryRole },...]
let peers = {}; // roomId: [peerId,...]

app.post('/createRoom', (req, res) => {
  const currentUser = req.body.currentUser;
  const roomObj = {
    email: currentUser.email,
    name: currentUser.displayName,
    primaryRole: 'teacher',
  };
  const roomId = uuidv4();
  rooms[roomId] = [roomObj];
  res.send(roomId);
});

const getParticipants = (roomId) => {
  let participants = [];
  for (let roomObj of rooms[roomId]) {
    for (let socketId of roomObj.sockets) {
      participants.push({
        email: roomObj.email,
        name: roomObj.name,
        socketId,
        role: sockets[socketId].role,
      });
    }
  }

  return participants;
};

io.on('connection', (socket) => {
  // user joins the room
  socket.on('join', ({ currentUser, roomId, isTeacher }, callback) => {
    console.log('in join');
    console.log(
      currentUser.email,
      currentUser.displayName,
      roomId,
      socket.id,
      isTeacher
    );

    if (!(roomId in rooms)) {
      console.log('line 61', roomId);
      callback({
        roomExists: false,
      });
      return;
    }

    let role = null;

    if (isTeacher === true) {
      // teacher access requested
      const roomUserIndex = rooms[roomId].findIndex(
        (roomObj) => roomObj.email === currentUser.email
      );
      if (
        roomUserIndex !== -1 &&
        rooms[roomId][roomUserIndex].primaryRole === 'teacher'
      ) {
        // teacher role present
        console.log('line 78');
        role = 'teacher';
      } else {
        // deny teacher access to the user
        console.log('line 82');
        callback({
          teacherAccess: false,
        });
        return;
      }
    } else {
      role = 'student';
    }

    sockets[socket.id] = {
      email: currentUser.email,
      name: currentUser.displayName,
      roomId,
      role,
    };

    const roomUserIndex = rooms[roomId].findIndex(
      (roomObj) => roomObj.email === currentUser.email
    );
    if (roomUserIndex !== -1) {
      console.log('line 101');
      const socketsInRoom = rooms[roomId][roomUserIndex].sockets;
      if (socketsInRoom === undefined) {
        rooms[roomId][roomUserIndex].sockets = [socket.id];
      } else {
        rooms[roomId][roomUserIndex].sockets.push(socket.id);
      }
      console.log('line 108', rooms[roomId][roomUserIndex]);
    } else {
      console.log('line 110');
      const roomObj = {
        email: currentUser.email,
        name: currentUser.displayName,
        sockets: [socket.id],
        primaryRole: role,
      };

      console.log('line 118', roomObj);

      rooms[roomId].push(roomObj);
    }

    console.log('line 123, rooms:', rooms);

    socket.join(roomId);

    io.to(roomId).emit('getParticipants', getParticipants(roomId));

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

    if (role === 'teacher') callback({ teacherAccess: true });
    else callback({});
  });

  // a message is sent over chat
  socket.on('sendMessage', (data) => {
    const socketUser = sockets[socket.id];
    console.log(data);
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
  });

  // socket gets disconnected
  socket.on('disconnect', (reason) => {
    console.log(reason);
    const socketUser = sockets[socket.id];
    if (socketUser) {
      console.log('in disconnect');
      console.log(socketUser);

      socket.broadcast.to(socketUser.roomId).emit('message', {
        user: 'Bot',
        to: 'Everyone',
        text: `${socketUser.name} just left`,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
      });

      rooms[socketUser.roomId].forEach((user) => {
        user.sockets = user.sockets.filter(
          (socketId) => socketId !== socket.id
        );
      });

      io.to(socketUser.roomId).emit(
        'getParticipants',
        getParticipants(socketUser.roomId)
      );

      delete sockets[socket.id];
    }
  });

  // for peer
  socket.on('peer-join', (peerId) => {
    const roomId = sockets[socket.id].roomId;

    if (roomId in peers) peers[roomId].push(peerId);
    else peers[roomId] = [peerId];

    socket.broadcast.to(roomId).emit('user-connected', peerId);

    socket.emit('getPeers', peers[roomId]);

    socket.on('disconnect', () => {
      peers[roomId].splice(peers[roomId].indexOf(peerId), 1);
      socket.broadcast.to(roomId).emit('user-disconnected', peerId);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
