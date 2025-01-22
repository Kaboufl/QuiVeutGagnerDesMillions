import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private socketUrl: string;

  constructor() {
    this.socketUrl = 'http://localhost:3001';
    this.socket = io(this.socketUrl, { autoConnect: false });
    
  }

  sendRoom(roomName: string, questionnaireId: string) {
    this.socket.emit('room', { roomName, questionnaireId });
  }

  joinLobby(lobbyId: string, username: string): Observable<any> {
    this.socket.connect();
    return new Observable((observer) => {
      this.socket.emit('join-lobby', { lobbyId, username })
        .on('no-room', (data) => {
          observer.error(data.message)
        })
        .on('roomData', (data: any) => {
          console.log('Données de la salle reçues :', data);
          observer.next(data);  // Envoie les données aux abonnés        
        })
        .on('playerInfo', (data: any) => {
          console.log('Informations du joueur reçues :', data);
          observer.next(data);  // Envoie les données aux abonnés
        }
        );
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
  
  listenToRoomClosed(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('room-closed', (data: any) => {
        console.log('La salle a été fermée :', data);
        observer.next(data);
        observer.complete(); 
      });
      return () => {
        this.socket.off('room-closed');
      };
    });
  }
  
}
