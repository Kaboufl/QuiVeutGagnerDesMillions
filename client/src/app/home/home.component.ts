import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/Data.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CreateLobbyComponent } from '../create-lobby/create-lobby.component';
import { SocketService } from '../../../services/Socket.service';
import { JoinLobbyComponent } from "../join-lobby/join-lobby.component";
import { LoadingQuestionComponent } from "../loading-question/loading-question.component";
import { GameService } from '../../../services/Game.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, JoinLobbyComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  public createLobby: boolean = false
  public joinLobby: boolean = false
  public loadingQuestion: boolean = false
  roomName: string = '';
  questionnaireId: string = '';


  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
  }

  onCreateLobbyClick() {
    this.gameService.createLobby()
      .subscribe({
        next: val => {
          this.router.navigate(['game', val.lobbyId]);
        },
        complete: () => {
          console.log('Création du salon terminée');
        }
      });
  }

  onJoinLobbyClick() {
    this.createLobby = false;
    this.joinLobby = true;
    this.loadingQuestion = false;
  }

  
}
