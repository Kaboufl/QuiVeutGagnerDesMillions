import { Component } from '@angular/core';
import { DataService } from '../../services/Data.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  imports: [HlmButtonDirective],
})
export class AppComponent {
  title = 'client';

  constructor(private dataService: DataService) {}

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
