import { Component, EventEmitter, Output } from '@angular/core';
import { SocketService } from '../../../services/Socket.service';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent {

  @Output() createRoomEvent = new EventEmitter<{ roomName: string, questionnaireId: string }>();  

  newRoomName: string = '';

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {}

  createRoomMethod(): void {
    const inputElement = document.querySelector('input') as HTMLInputElement;
    if (inputElement) {
      this.newRoomName = inputElement.value;
      console.log(this.newRoomName, "Ma salle s'appelle");
    }
    this.socketService.sendRoom(this.newRoomName, "1");

    this.createRoomEvent.emit({ roomName: this.newRoomName, questionnaireId: '1' });
  }
}
