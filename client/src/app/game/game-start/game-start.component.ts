import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../../../services/Game.service';
import Question from '../../../../models/question';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SocketService } from '../../../../services/Socket.service';

@Component({
  selector: 'app-game-start',
  imports: [CommonModule],
  templateUrl: './game-start.component.html',
  styleUrls: ['./game-start.component.css']
})
export class GameStartComponent implements OnInit {
  timer: number = 10; 
  interval: any;
  progressBarWidth: number = 100;
  selectedAnswer: number | null = null; 
  isAnswerable: boolean = true;
  isAnswerSelected: boolean = false; 
  currentQuestion = new BehaviorSubject<Question | null>(null);
  players : any[] = [];
  allAnswers: { [questionId: number]: { [playerId: string]: { answer: number, player: string, questionId: number } } } = {};
  scores: { [playerId: string]: number } = {};
  isShowingRanking: boolean = false; 
  isGameFinished: boolean = false; 
  isFinalRankingDisplayed: boolean = false;
  playerResponseTimes: { [playerId: string]: number } = {};
  
  constructor(public gameService: GameService, private socketService: SocketService) {
    this.updateCurrentQuestion();
    this.gameService.listenToGameStart().subscribe({
      next: data => {
        this.updateCurrentQuestion();
      }
    });
  }

  ngOnInit(): void {
    this.players = this.gameService.players;
    console.log('players:', this.players);
    console.log('Questions:', this.gameService.questions);
    
    // Initialiser les scores de tous les joueurs à 0
    this.players.forEach(player => {
      this.scores[player.user_identifier] = 0;
    });
    
    // Si le maître peut aussi jouer, initialiser son score
    if (this.gameService.master) {
      this.scores[this.gameService.master.user_identifier] = 0;
    }
    
    this.startTimer();

    this.gameService.listenForScoreUpdates().subscribe({
      next: (data) => {
        console.log('Scores reçus depuis le serveur:', data);
        console.log('Est-ce le maître?', this.gameService.isMaster);
        
        if (data && typeof data === 'object') {
          this.scores = data.scores || data;
          
          if (data.isFinal) {
            console.log('Classement final reçu!');
            this.isGameFinished = true;
            this.isFinalRankingDisplayed = true;
          } else {
            this.isShowingRanking = true;
            
            setTimeout(() => {
              this.isShowingRanking = false;
            }, 3000);
          }
        } else {
          console.error('Format de scores invalide:', data);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la réception des scores:', err);
      }
    });
  }

  startTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  
    const timer = this.timer * 10;
    let progress = timer;
  
    const lastAnswers: { [playerId: string]: { player: string, answer: number, question: number, timeElapsed?: number } } = {};
    this.playerResponseTimes = {};
  
    this.interval = setInterval(() => {
      progress--;
      this.progressBarWidth = (progress / timer) * 100;
      this.timer = Math.ceil(progress / 10);
  
      this.gameService.listenForAnswer().subscribe(data => {
        const questionId = this.gameService.questions[this.gameService.currentQuestionIndex].id;
  
        if (!this.playerResponseTimes[data.player]) {
          // Temps écoulé = temps initial (10) - temps restant
          const timeElapsed = 10 - this.timer;
          this.playerResponseTimes[data.player] = timeElapsed;
          console.log(`Joueur ${data.player} a répondu en ${timeElapsed} secondes`);
        }
  
        lastAnswers[data.player] = {
          player: data.player,
          answer: data.answer,
          question: questionId,
          timeElapsed: this.playerResponseTimes[data.player]
        };
  
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
        clearInterval(this.interval);
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
  }

  handleLastAnswers(lastAnswers: any[]): void {
    const currentQuestionId = this.gameService.questions[this.gameService.currentQuestionIndex].id;
  
    lastAnswers.forEach(data => {
      if (data.question === currentQuestionId) { // Vérifier que la réponse correspond à la question actuelle
        const question = this.gameService.questions.find(q => q.id === data.question);
        if (question && data.answer === question.correct_answer) {
          const timeElapsed = data.timeElapsed || 10;
          let points = 0;
  
          if (timeElapsed <= 5) {
            points = 10; 
          } else if (timeElapsed <= 10) {
            points = 5; 
          } else {
            points = 2;
          }
  
          if (!this.scores[data.player]) {
            this.scores[data.player] = 0;
          }
          this.scores[data.player] += points;
          
          console.log(`Le joueur ${data.player} a répondu correctement en ${timeElapsed} secondes et gagne ${points} points`);
        } else {
          console.log(`Le joueur ${data.player} a répondu incorrectement à la question ${data.question}`);
        }
  
        console.log(`Le joueur ${data.player} a répondu : ${data.answer} à la question ${data.question}`);
      }
    });
  
    console.log('Scores mis à jour :', this.scores);
  }

  nextQuestion(): void {
    this.showRanking();
  
    if (this.gameService.currentQuestionIndex >= this.gameService.questions.length - 1) {
      this.isGameFinished = true;
      this.showFinalRanking();
      return;
    }
  
    this.gameService.currentQuestionIndex++;
    this.selectedAnswer = null;
    this.isAnswerSelected = false;
    this.isAnswerable = true;
    this.timer = 10; 
    this.progressBarWidth = 100; 
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

  showRanking(): void {
    const sortedPlayers = this.getSortedPlayers();
    
    console.log('Classement :');
    sortedPlayers.forEach((playerId, index) => {
      const username = this.getPlayerUsername(playerId);
      console.log(`${index + 1}. ${username}: ${this.scores[playerId]} points`);
    });
    
    if (this.gameService.isMaster) {
      console.log('this.game')
      console.log("Je suis le maître, j'envoie les scores:", JSON.stringify(this.scores));
      this.gameService.sendScoreUpdate({...this.scores});
    }
    
    this.isShowingRanking = true;
    
    setTimeout(() => {
      this.isShowingRanking = false;
    }, 3000);
  }

  getPlayerUsername(playerId: string): string {
    console.log('Recherche du joueur avec l\'ID:', playerId);
  
    let player = this.players.find(p => p.user_identifier === playerId);
  
    if (!player && this.gameService.master) {
      player = this.gameService.master.user_identifier === playerId ? this.gameService.master : null;
    }
  
    console.log('Joueur trouvé:', player);
    return player ? player.username : playerId;
  }
  

  getSortedPlayers(): string[] {
    return Object.keys(this.scores).sort((a, b) => this.scores[b] - this.scores[a]);
  }

  showFinalRanking(): void {
    const sortedPlayers = this.getSortedPlayers();
    
    console.log('Classement final:');
    sortedPlayers.forEach((playerId, index) => {
      const username = this.getPlayerUsername(playerId);
      console.log(`${index + 1}. ${username}: ${this.scores[playerId]} points`);
    });
    
    if (this.gameService.isMaster) {
      console.log("Je suis le maître, j'envoie le classement final:", JSON.stringify(this.scores));
      
      this.socketService.sendFinalScores({
        scores: this.scores,
        isFinal: true
      });
    }
    
    this.isFinalRankingDisplayed = true;
  }

  returnToHome(): void {
    this.gameService.disconnect();
    window.location.href = '/';
  }

  getRank(index: number): number {
    if (index === 0) return 1;
    
    const currentPlayerId = this.getSortedPlayers()[index];
    const previousPlayerId = this.getSortedPlayers()[index-1];
    
    if (this.scores[currentPlayerId] === this.scores[previousPlayerId]) {
      return this.getRank(index-1);
    }
    
    return index + 1;
  }
}
