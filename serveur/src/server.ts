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

    res.json({ "lobbyId": roomName });
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
        console.log(`Lobby ID: ${lobbyId}`);
    
        const lobbyRequest = db('rooms').where('room_id', lobbyId);
        const lobby = await lobbyRequest.first();
    
        if (lobby && username) {
            socket.join(lobbyId);
    
            const existingPlayers = await db('players').where('room_id', lobbyId);
            const isMaster = existingPlayers.length === 0; // Le premier joueur devient le maître.
    
            // Ajout du joueur à la base de données
            const [playerId] = await db('players')
                .returning('id')
                .insert({
                    room_id: lobbyId,
                    username: username,
                    user_identifier: socket.id,
                    is_master: isMaster,
                });
    
            console.log(`User ${username} joined lobby ${lobbyId}`);
    
            const playerIds = Array.from(io.sockets.adapter.rooms.get(lobbyId) || []);
            const players = await Promise.all(
                playerIds.map(async (clientId) => {
                    return await db('players').where('user_identifier', clientId).first();
                })
            );
    
            console.log('Current players in lobby:', players);
    
            io.to(lobbyId).emit('roomData', {
                message: `User ${username} joined the room`,
                players, 
                lobbyId,
            });
        } else {
            socket.emit('no-room', { message: 'No such room' });
        }
    });
    
    

    socket.on('disconnect', async () => {
        const request = db('players').where('user_identifier', socket.id);
        const player = await request.first();
    
        if (player !== undefined) {
            await request.delete();
            console.log(`${player.username} disconnected from room ${player.room_id}`);
        } else {
            console.log(`User with ID ${socket.id} disconnected, but was not enlisted in a room`);
        }
    
        if (player && player.is_master) {
            const roomId = player.room_id;
    
            await db('players').where('room_id', roomId).delete();
    
            await db('rooms').where('room_id', roomId).delete();
    
            io.to(roomId).emit('room-closed', {
                message: 'The master player has disconnected. The room has been closed.'
            });
            console.log(`Room ${roomId} has been closed because the master player disconnected.`);
        }
    });
    
});




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
