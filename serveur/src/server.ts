import express, { Request, Response } from 'express';
import knex from 'knex';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import { db } from './db/db';

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

app.get('/', cors(), (req: Request, res: Response) => {
    res.json({ message: `Hello World!` });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('room', ({ roomName, questionnaireId }) => {
      socket.join(roomName);
      console.log(`User joined room: ${roomName} with questionnaireId: ${questionnaireId}`);

      const clients = io.sockets.adapter.rooms.get(roomName);
      const clientIds = clients ? Array.from(clients) : [];
      console.log('clients', clientIds);

      io.to(roomName).emit('roomData', {
          roomName: roomName,
          clientIds: clientIds
      });
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
