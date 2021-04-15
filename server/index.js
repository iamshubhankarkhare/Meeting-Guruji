const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
cors: var cors = require('cors');

app.get('/', (req, res) => {
  res.send('hello');
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('connection made');

  socket.emit('getrooms', 'room');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
