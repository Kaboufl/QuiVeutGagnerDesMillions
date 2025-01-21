import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SocketService } from '../../../services/Socket.service';
import { GameService } from '../../../services/Game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent {

  @Output() createRoomEvent = new EventEmitter<{ roomName: string, questionnaireId: string }>();  

  newRoomName: string = '';
  private readonly router = inject(Router);

  constructor(private gameService: GameService) {}

  ngOnInit(): void {}

  createLobby() {
    this.gameService.createLobby()
      .subscribe({
        next: val => {
          console.log(this.gameService.lobbyId);
        }
      });
  }

  // createRoomMethod(): void {
  //   const inputElement = document.querySelector('input') as HTMLInputElement;
  //   if (inputElement) {
  //     this.newRoomName = inputElement.value;
  //     console.log(this.newRoomName, "Ma salle s'appelle");
  //   }
  //   this.socketService.sendRoom(this.newRoomName, "1");

  //   this.createRoomEvent.emit({ roomName: this.newRoomName, questionnaireId: '1' });
  // }
}
