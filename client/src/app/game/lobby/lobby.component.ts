import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../../services/Game.service';
import { Subscription } from 'rxjs';
import Player from '../../../../models/player';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { PopupEditGameComponent } from '../popup-edit-game/popup-edit-game.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  imports : [CommonModule,PopupEditGameComponent]
})
export class LobbyComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private roomClosedSubscription: Subscription | null = null;
  public players: Player[] = [];
  public currentplayer!: Player;
  public showSettingsPopup = false; // Etat pour gérer l'affichage de la popup
  public qrCodeUrl: string = '';  // URL pour le QR code

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

    this.gameService.joinLobby(lobbyId!).subscribe({
      next: (data) => {
        if (data.type === 'roomData') {
          console.log('Données de la salle:', data.data);
          this.players = data.data.players;
        } else if (data.type === 'playerInfo') {
          console.log('Informations du joueur:', data.data);
          this.currentplayer = data.data;
        }

        // Générer l'URL pour le QR code
        this.generateQrCodeUrl(lobbyId!);
      },
      error: (err) => { 
        console.error(err);
        this.gameService.disconnect();
        this.router.navigate(['/']);
      }
    });

    console.log('Lobby ID:', lobbyId);
  }

  generateQrCodeUrl(lobbyId: string): void {
    const baseUrl = `${window.location.origin}/game/${lobbyId}`;
    // Générer le QR code
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

  listenToRoomClosed(): void {
  }
}
