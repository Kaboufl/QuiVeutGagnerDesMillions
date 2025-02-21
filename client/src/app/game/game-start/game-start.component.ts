import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, Signal, signal } from '@angular/core';
import { GameService } from '../../../../services/Game.service';
import Question from '../../../../models/question';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-game-start',
  imports: [CommonModule],
  templateUrl: './game-start.component.html',
  styleUrls: ['./game-start.component.css']
})
export class GameStartComponent implements OnInit {
  timer: number = 10; // Temps en secondes
  interval: any;
  progressBarWidth: number = 100;
  selectedAnswer: number | null = null; // Réponse sélectionnée
  isAnswerable: boolean = true;
  isAnswerSelected: boolean = false; // Indicateur pour savoir si une réponse a été sélectionnée
  currentQuestion = new BehaviorSubject<Question | null>(null);

  constructor(private gameService: GameService) {
    this.updateCurrentQuestion();
    this.gameService.listenToGameStart().subscribe({
      next: data => {
        this.updateCurrentQuestion();
      }
    })
  }

  ngOnInit(): void {
    console.log('Questions:', this.gameService.questions);
    this.startTimer();
  }
  

  startTimer(): void {
    // Mise à jour de la barre de progression et du timer toutes les secondes
    const timer = this.timer * 10;
    let progress = timer;
    const interval = setInterval(() => {
      progress--;
      this.progressBarWidth = (progress / timer) * 100; // Mise à jour de la barre de progression
      if (progress === 0) {
        clearInterval(interval);  // Arrêt du timer à 0
        progress = 0;
        this.isAnswerable = false;
        this.revealAnswers(); // Révéler les réponses à la fin du temps
        setTimeout(() => {
          this.nextQuestion();
        }, 2000);
      }
    }, 100);
  }

  nextQuestion(): void {
    this.gameService.currentQuestionIndex++;
    this.selectedAnswer = null;
    this.isAnswerSelected = false;
    this.isAnswerable = true;
    this.updateCurrentQuestion();
    this.startTimer();
  }

  answer(selectedAnswer: number): void {
    this.selectedAnswer = selectedAnswer; // Stocke la réponse sélectionnée
    this.gameService.answerQuestion(selectedAnswer).subscribe(); // Envoie la réponse au serveur
    console.log('Réponse sélectionnée:', selectedAnswer);
  }

  revealAnswers(): void {
    this.isAnswerSelected = true;  // Marque que le temps est écoulé et les réponses doivent être révélées
  }

  private updateCurrentQuestion(): void {
    this.currentQuestion.next(this.gameService.questions[this.gameService.currentQuestionIndex]);
  }
}
