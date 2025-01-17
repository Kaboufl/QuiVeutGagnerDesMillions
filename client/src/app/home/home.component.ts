import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/Data.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CreateLobbyComponent } from '../create-lobby/create-lobby.component';
import { SocketService } from '../../../services/Socket.service';
import { JoinLobbyComponent } from "../join-lobby/join-lobby.component";
import { LoadingQuestionComponent } from "../loading-question/loading-question.component";

@Component({
  selector: 'app-home',
  imports: [CreateLobbyComponent, CommonModule, JoinLobbyComponent, LoadingQuestionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  public createLobby: boolean = false
  public joinLobby: boolean = false
  public loadingQuestion: boolean = false
  roomName: string = '';
  questionnaireId: string = '';

  constructor(private dataService: DataService, private SocketService : SocketService) {}

  onCreateLobbyClick() {
    this.createLobby = true;
    this.joinLobby = false;
    this.loadingQuestion = false;
  }

  onJoinLobbyClick() {
    this.createLobby = false;
    this.joinLobby = true;
    this.loadingQuestion = false;
  }

  ondataclick() {
    console.log('je récupère le clic');

    const observer = {
      next: (data: any) => {
        console.log('Données récupérées :', data);
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      },
      complete: () => {
        console.log('Données récupérées avec succès.');
      },
    };

    this.dataService.getData('').subscribe(observer);
  }

  onCreateRoom($event: { roomName: string; questionnaireId: string }): void {
    const { roomName, questionnaireId } = $event; 
    console.log('Je reçois l\'événement de création de salon', $event);
    this.createLobby = false;
    this.joinLobby = false;
    console.log("Un salon a été créé avec le nom : ", roomName);
    console.log("Questionnaire lié :", questionnaireId);
    this.roomName = roomName;
    this.loadingQuestion = true;
    this.questionnaireId = questionnaireId
  }
  
  onJoinRoom($event: { roomName: string; questionnaireId: string }): void {
    const { roomName, questionnaireId } = $event; 
    console.log('Je reçois l\'événement de rejoindre un salon', $event);
    this.createLobby = false;
    this.joinLobby = false;
    console.log("Un utilisateur a rejoint le salon : ", roomName);
    console.log("Questionnaire lié :", questionnaireId);
    this.roomName = roomName;
    this.loadingQuestion = true;
    this.questionnaireId = questionnaireId;
  }
  
}
