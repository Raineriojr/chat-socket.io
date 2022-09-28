import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { join } from 'path'
import url from 'url'

const app = express();
const server = http.createServer(app);
const io = new Server(server)

const port = 3001
const filepath = url.fileURLToPath(import.meta.url)
const root = join(filepath, '../../')

app.get('/', async (req, res) => {
  const file = join(root, '/public/index.html')
  res.sendFile(file)
})

io.on('connection', (socket) => {
  console.log(`new user conected: ${socket.id}`);
  io.emit('user-connected', `User ${socket.id} is connected`)

  socket.on('chat', (msg) => {
    io.emit('chat', socket.id + ': ' + msg);
  });

  socket.on('typing', () => {
    io.emit('typing', `user ${socket.id} is typing`)
  })


  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
    io.emit('user-disconnected', `User ${socket.id} has been disconnected`)
  });
})

server.listen(port, () => console.log(`server running in ${port}`))