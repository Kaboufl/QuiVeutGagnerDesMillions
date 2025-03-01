import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../../services/Game.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import Player from '../../../../models/player';
import QRCode from 'qrcode';
import { PopupEditGameComponent } from '../popup-edit-game/popup-edit-game.component';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { GameStartComponent } from '../game-start/game-start.component';
import { SocketService } from '../../../../services/Socket.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports : [CommonModule, PopupEditGameComponent, FormsModule, HlmButtonDirective, HlmInputDirective, GameStartComponent]
})
export class LobbyComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public username: string = '';
  public isLobbyJoined: boolean = false;

  public players: Player[] = [];
  public currentplayer!: Player;
  public showSettingsPopup = false;
  public qrCodeUrl: string = '';  
  public master!: Player;
  public isMaster = computed(() => this.master?.username === this.username);
  GameStart: boolean = false;

  constructor(private gameService: GameService, private socketService : SocketService) {}

  ngOnInit(): void {
    const lobbyId = this.route.snapshot.paramMap.get('lobby_id');
    if (lobbyId) {
        this.generateQrCodeUrl(lobbyId);
    }

    this.gameService.listenToGameStart().subscribe({
      next: data => {
        console.log('Le jeu a commencé ! ', data);
        this.GameStart = true;
      }
    })

    // Écoute l'événement 'room-closed'
    this.gameService.listenToRoomClosed().subscribe({
        next: (data) => {
            console.log('La salle a été fermée :', data);
            alert(data.message);
            this.router.navigate(['/']);
        },
        error: (err) => {
            console.error('Erreur lors de la réception de l\'événement room-closed :', err);
        },
    });

    this.gameService.lobbyId = lobbyId || '';
    console.log('Lobby ID:', lobbyId);
}

  generateQrCodeUrl(lobbyId: string): void {
    const baseUrl = `${window.location.origin}/game/${lobbyId}`;
    QRCode.toDataURL(baseUrl, (err, url) => {
      if (err) {
        console.error('Erreur lors de la génération du QR code:', err);
      } else {
        this.qrCodeUrl = url;
        console.log('URL du QR code:', url);
      }
    });
  }

  toggleSettingsPopup(): void {
    this.showSettingsPopup = !this.showSettingsPopup;
  }

  joinLobby() {
    this.gameService.joinLobby(this.gameService.lobbyId, this.username)
      .subscribe({
        next: (data) => {
          console.log('Join lobby data:', data);
          this.isLobbyJoined = true;
          this.players = this.gameService.players;
          this.master = this.gameService.master;
          console.log('Players:', this.players);
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

  startGame() {    
    if (this.gameService.lobbyId) {
      console.log('Start game pour la salle:', this.gameService.lobbyId);
      this.gameService.startGame().subscribe({
        next: (data) => {
          console.log('Game started:', data);
          // this.GameStart = true
          // this.Questions = data
        },
        error: (err) => {
          console.error('Erreur lors du démarrage du jeu:', err);
        }
      });
    } else {
      console.error('Lobby ID manquant');
    }
  }
}
