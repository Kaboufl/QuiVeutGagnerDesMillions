import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../../services/Game.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import Player from '../../../../models/player';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports : [CommonModule, FormsModule, HlmButtonDirective, HlmInputDirective]
})
export class LobbyComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public username: string = '';
  public isLobbyJoined: boolean = false;

  public players: Player[] = [];
  public master!: Player;

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
    this.gameService.lobbyId = lobbyId || '';
      
    console.log('Lobby ID:', lobbyId);
  }

  joinLobby() {
    this.gameService.joinLobby(this.gameService.lobbyId, this.username)
      .subscribe({
        next: (data) => {
          console.log('Join lobby data:', data);
          this.isLobbyJoined = true;
          this.players = this.gameService.players;
          this.master = this.gameService.master;
        },
        error: (err) => {
          console.error(err);
          this.gameService.disconnect();
          this.router.navigate(['/']);
        }
      });
  }

  logPlayer() {
    console.log(this.gameService.player());
  }
}
