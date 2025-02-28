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
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

app.use(express.json()); // Pour parser les requêtes JSON

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
});

app.post('/start-game', async (req: Request, res: Response): Promise<void> => {
    const { roomId } = req.body;

    console.log('roomId reçu:', roomId);

    try {
        const randomQuestions = await db('questions').orderByRaw('RAND()').limit(5);
        
        for (const question of randomQuestions) {
            await db('room_questions').insert({
                room_id: roomId,
                question_id: question.id
            });
        }

        io.to(roomId).emit('game-started', {
            message: 'Le jeu a commencé!',
            questions: randomQuestions,
        });

        res.status(200).json({ message: 'Le jeu a commencé!', questions: randomQuestions });

        } catch (error) {
        console.error('Erreur lors du démarrage du jeu:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
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

    socket.on('join-lobby', async ({ lobbyId, username }) => {
        console.log(`Lobby ID: ${lobbyId}`);
    
        const lobbyRequest = db('rooms').where('room_id', lobbyId);
        const lobby = await lobbyRequest.first();
    
        if (lobby && username) {
            socket.join(lobbyId);
    
            const existingPlayers = await db('players').where('room_id', lobbyId);
            const isMaster = existingPlayers.length === 0; // Le premier joueur devient le maître.
    
            const [playerId] = await db('players')
                .returning('id')
                .insert({
                    room_id: lobbyId,
                    username: username,
                    user_identifier: socket.id,
                    is_master: isMaster,
                });
    
            console.log(`User ${username} joined lobby ${lobbyId}`);
    
            socket.emit('player-info', {
                room_id: lobbyId,
                username: username,
                user_identifier: socket.id,
                is_master: isMaster
            });

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

    socket.on('answer-question', async (data) => {
        const { questionId, answer } = data;

        console.log(`User ${socket.id} answered question ${questionId} with answer ${answer}`);

        const player = await db('players').where('user_identifier', socket.id).first();
        const master = await db('players').where('room_id', player.room_id).where('is_master', true).first();

        io.sockets.to(master.user_identifier).emit('question-answered', {
            player: socket.id,
            answer: answer,
            question: questionId
        });
    });

    socket.on('score-update', (scores) => {
        console.log("Scores reçus du maître:", scores);
        const roomName = Array.from(socket.rooms)[1]; 
        if (roomName) {
            // Envoyer les scores à tous les joueurs de la salle
            io.to(roomName).emit('score-update', scores);
            console.log(`Scores envoyés à la salle ${roomName}:`, scores);
        }
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
