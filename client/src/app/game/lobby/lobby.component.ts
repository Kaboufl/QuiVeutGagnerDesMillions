import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../../services/Game.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    const lobbyId = this.route.snapshot.paramMap.get('lobby_id');

    this.gameService.joinLobby(lobbyId!)
      .subscribe({
        next: (data) => {
          console.log('Lobby data:', data);
        },
        error: (err) => { 
          console.error(err);
          this.gameService.disconnect();
          this.router.navigate(['/']);
        }
      });
      
    console.log('Lobby ID:', lobbyId);
  }
}
