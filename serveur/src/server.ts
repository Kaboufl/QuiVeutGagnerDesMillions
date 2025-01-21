import express, { Request, Response } from 'express';
import knex from 'knex';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import { db } from './db/db';
import { randomBytes } from 'crypto';

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

app.post('/request-room', (req: Request, res: Response) => {
    const roomName = randomBytes(3).toString('hex').substring(0, 5).toUpperCase();

    db('rooms').insert({
        "room_id": roomName
    }).then((result) => {
        console.log(result)
    });

    res.json({ roomName });
})

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

    socket.on('join-lobby', async ({ lobbyId, username }) => {
        console.log(lobbyId)
        const lobbyRequest = db('rooms').where('room_id', lobbyId);
        const lobby = await lobbyRequest.first();


        if (lobby && username) {
            socket.join(lobbyId);
            const playerId = await db('players').returning('id')
                .insert({
                    "room_id": lobbyId,
                    "username": username,
                    "user_identifier": socket.id
                })

            if (!lobby.master_id) {
                await lobbyRequest.update({ master_id: playerId });
                console.log(`User ${username} with socketID ${socket.id} is now the master of the room ${lobby.id}`);
            }

            const playerIds = Array.from(io.sockets.adapter.rooms.get(lobbyId) || []);
            console.log('players IDs', playerIds);
            const players = playerIds.map(async (client) => {
                return await db('players').where('user_identifier', client).first();
            })

            console.log(`User ${username} joined with code ${lobbyId}`);
            socket.emit('roomData', { 
                message: `Joined room ${lobbyId}`,
                players,
                lobbyId            
            })
        } else {
            socket.emit('no-room', { message: 'no such room' });
        }
    });

    socket.on('disconnect', async () => {
        const request = db('players').where('user_identifier', socket.id);
        const player = await request.first();
        
        if (player !== undefined) {
            request.delete().then((res) => {
                console.log(`${player.username} disconnected from room ${player.room_id}`)
            })
        } else {
            console.log(`User with ID ${socket.id} disconnected, but was not enlisted in a room`)
        }
    });
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
