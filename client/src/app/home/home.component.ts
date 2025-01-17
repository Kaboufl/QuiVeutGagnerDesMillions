import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/Data.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CreateLobbyComponent } from '../create-lobby/create-lobby.component';

@Component({
  selector: 'app-home',
  imports: [CreateLobbyComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public createLobby: boolean = false
  public joinLobby: boolean = false

  constructor(private dataService: DataService) {}

  onCreateLobbyClick() {
    this.createLobby = true;
    this.joinLobby = false;
  }

  onJoinLobbyClick() {
    this.createLobby = false;
    this.joinLobby = true;
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
}
