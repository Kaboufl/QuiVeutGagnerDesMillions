import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../../services/Game.service';
import { Subscription } from 'rxjs';
import Player from '../../../../models/player';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports : [CommonModule]
})
export class LobbyComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private roomClosedSubscription: Subscription | null = null;
  public players: Player[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.listenToRoomClosed().subscribe({
      next: (data) => {
        console.log('La salle a été fermée :', data);
        alert(data.message);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erreur lors de la réception de l\'événement room-closed :', err);
      }
    });

    const lobbyId = this.route.snapshot.paramMap.get('lobby_id');

    this.gameService.joinLobby(lobbyId!)
      .subscribe({
        next: (data) => {
          console.log('Lobby data:', data);
          this.players = data.players;
        },
        error: (err) => { 
          console.error(err);
          this.gameService.disconnect();
          this.router.navigate(['/']);
        }
      });
      
    console.log('Lobby ID:', lobbyId);
  }

  listenToRoomClosed(): void {

  }
}
