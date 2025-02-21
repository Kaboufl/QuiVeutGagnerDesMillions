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
    this.socketUrl = 'http://localhost:4200';
    this.socket = io(this.socketUrl, { autoConnect: false });
    
  }

  listenToGameStarted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('game-started', (data: any) => {
        observer.next(data);
      })
    })
}

  sendRoom(roomName: string, questionnaireId: string) {
    this.socket.emit('room', { roomName, questionnaireId });
  }

  joinLobby(lobbyId: string, username: string): Observable<any> {
    this.socket.connect();
    
    return new Observable((observer) => {
  
      this.socket.on('no-room', (data) => {
        observer.error(data.message);
      });
      this.socket.emit('join-lobby', { lobbyId, username })
      .on('no-room', (data) => {
        observer.error(data.message)
      })
      .on('roomData', (data: any) => {
        // console.log('Données de la salle reçues :', data);
        observer.next(data);  // Envoie les données aux abonnés        
      })
      .on('playerInfo', (data: any) => {
        console.log('Informations du joueur reçues :', data);
        observer.next(data);  // Envoie les données aux abonnés
      });
  
      return () => {
        this.socket.off('no-room');
        this.socket.off('roomData');
        this.socket.off('player-info');
      };
      
    });
  }

  answerQuestion(question:number, answer: number): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('answer-question', {
        questionId: question,
        answer: answer
      });
    });
  }

  listenForAnswers(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('question-answered', (data: any) => {
        observer.next(data);
      })
    })
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
