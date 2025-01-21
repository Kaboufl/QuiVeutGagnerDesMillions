import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../../services/Game.service';

@Component({
  selector: 'app-join-lobby',
  imports: [],
  templateUrl: './join-lobby.component.html',
  styleUrl: './join-lobby.component.css'
})
export class JoinLobbyComponent {

  private readonly router = inject(Router);
  
  public lobbyId: string = '';
  constructor(private gameService: GameService) {}

  onJoinLobbyClick() {
    const inputElement = document.querySelector('input') as HTMLInputElement;
    if (inputElement) {
      this.lobbyId = inputElement.value;
    }
    this.router.navigate(['game', this.lobbyId])
  }
}
