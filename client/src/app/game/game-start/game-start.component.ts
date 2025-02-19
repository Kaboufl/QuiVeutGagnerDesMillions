import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-start',
  imports: [CommonModule],
  templateUrl: './game-start.component.html',
  styleUrls: ['./game-start.component.css']
})
export class GameStartComponent implements OnInit {
  @Input() Questions: any[] = [];
  timer: number = 10; // Temps en secondes
  interval: any;
  progressBarWidth: number = 100;
  selectedAnswer: number | null = null; // Réponse sélectionnée
  isAnswerSelected: boolean = false; // Indicateur pour savoir si une réponse a été sélectionnée

  constructor() { }

  ngOnInit(): void {
    console.log('Questions:', this.Questions);
    this.startTimer();
  }

  startTimer(): void {
    // Mise à jour de la barre de progression et du timer toutes les secondes
    this.interval = setInterval(() => {
      this.timer--;
      this.progressBarWidth = (this.timer / 10) * 100; // Mise à jour de la barre de progression
      if (this.timer === 0) {
        clearInterval(this.interval);  // Arrêt du timer à 0
        this.timer = 0;
        this.revealAnswers(); // Révéler les réponses à la fin du temps
      }
    }, 1000);
  }

  answer(selectedAnswer: number): void {
    this.selectedAnswer = selectedAnswer; // Stocke la réponse sélectionnée
    console.log('Réponse sélectionnée:', selectedAnswer);
    this.isAnswerSelected = true; // Marque qu'une réponse a été sélectionnée
  }

  revealAnswers(): void {
    this.isAnswerSelected = true;  // Marque que le temps est écoulé et les réponses doivent être révélées
  }
}
