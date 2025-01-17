import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3001');
  }

  sendRoom(roomName: string, questionnaireId: string) {
    this.socket.emit('room', { roomName, questionnaireId });
  }

  listenRoomData() {
    return new Observable((observer) => {
      this.socket.on('roomData', (data: any) => {
        console.log('Données de la salle reçues :', data);
        observer.next(data);  // Envoie les données aux abonnés
      });
    });
  }
}
