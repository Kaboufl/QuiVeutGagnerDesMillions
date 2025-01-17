import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SocketService } from '../../../services/Socket.service';

@Component({
  selector: 'app-join-lobby',
  imports: [],
  templateUrl: './join-lobby.component.html',
  styleUrl: './join-lobby.component.css'
})
export class JoinLobbyComponent implements OnInit {
  
  @Output() JoiningRoom = new EventEmitter<{ roomName: string, questionnaireId: string }>();  

  newRoomName: string = '';
  constructor(private SocketService : SocketService) {}

  ngOnInit(): void {}

  onJoinLobbyClick() {
    const inputElement = document.querySelector('input') as HTMLInputElement;
    if (inputElement) {
      this.newRoomName = inputElement.value;
    }
    //this.SocketService.sendRoom(this.newRoomName,"1");
    this.SocketService.joinLobby(this.newRoomName)
      .subscribe({
        error: (err) => {console.error(err)},
        next: (value) => {
          this.JoiningRoom.emit({ roomName: value.lobbyId, questionnaireId: '1' })
        }
      })
  }
}
