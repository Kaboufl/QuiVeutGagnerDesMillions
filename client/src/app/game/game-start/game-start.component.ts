import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../../../services/Game.service';
import Question from '../../../../models/question';
import { BehaviorSubject, Subscription } from 'rxjs';

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
  players : any[] = [];
  allAnswers: { [questionId: number]: { [playerId: string]: { answer: number, player: string, questionId: number } } } = {}; // Structure pour stocker toutes les réponses, y compris l'ID de la question

  constructor(private gameService: GameService) {
    this.updateCurrentQuestion();
    this.gameService.listenToGameStart().subscribe({
      next: data => {
        this.updateCurrentQuestion();
      }
    });
  }

  ngOnInit(): void {
    this.players = this.gameService.players;
    console.log('Questions:', this.gameService.questions);
    this.startTimer();
  }

  startTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    const timer = this.timer * 10;
    let progress = timer;

    const lastAnswers: { [playerId: string]: { player: string, answer: number, question: number } } = {};

    const interval = setInterval(() => {
      progress--;
      this.progressBarWidth = (progress / timer) * 100;

      this.timer = Math.ceil(progress / 10);

      this.gameService.listenForAnswer().subscribe(data => {
        const questionId = this.gameService.questions[this.gameService.currentQuestionIndex].id;
        if (!this.allAnswers[questionId]) {
          this.allAnswers[questionId] = {};
        }
        this.allAnswers[questionId][data.player] = { 
          answer: data.answer, 
          player: data.player, 
          questionId: questionId 
        };
        console.log(`Réponse mise à jour pour ${data.player}: ${data.answer} à la question ${questionId}`);
        console.log('Toutes les réponses :', this.allAnswers);
      });

      if (progress === 0) {
        clearInterval(interval);
        progress = 0;
        this.isAnswerable = false;
        this.revealAnswers();

        const finalAnswers = Object.values(lastAnswers); 

        console.log("Dernières réponses collectées : ", finalAnswers);
        this.handleLastAnswers(finalAnswers);

        setTimeout(() => {
          this.nextQuestion();
        }, 2000);
      }
    }, 100);

    this.interval = interval;
  }

  handleLastAnswers(lastAnswers: any[]): void {
    lastAnswers.forEach(data => {
      console.log(`Le joueur ${data.player} a répondu : ${data.answer} à la question ${data.question}`);
    });
  }

  nextQuestion(): void {
    this.gameService.currentQuestionIndex++;
    this.selectedAnswer = null;
    this.isAnswerSelected = false;
    this.isAnswerable = true;
    this.timer = 10; // Réinitialiser le timer
    this.progressBarWidth = 100; // Réinitialiser la barre de progression
    this.updateCurrentQuestion();
    this.startTimer();
  }

  answer(selectedAnswer: number): void {
    this.selectedAnswer = selectedAnswer;
    this.gameService.answerQuestion(selectedAnswer).subscribe();
    console.log('Réponse sélectionnée:', selectedAnswer);
  }

  revealAnswers(): void {
    this.isAnswerSelected = true; 
  }

  private updateCurrentQuestion(): void {
    this.currentQuestion.next(this.gameService.questions[this.gameService.currentQuestionIndex]);
  }
}
