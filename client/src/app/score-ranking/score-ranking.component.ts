import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-score-ranking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="score-container mx-auto p-6 max-w-lg bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-4">Résultats</h2>
      
      <!-- Résultat de la question précédente -->
      <div class="mb-6">
        <p class="text-lg font-semibold"><strong>Question:</strong> {{ questionText }}</p>
        <p class="text-md mt-2">
          <strong>Bonne réponse:</strong> 
          <span class="text-green-600 font-semibold">{{ correctAnswerText }}</span>
        </p>
      </div>
      
      <!-- Classement des joueurs -->
      <div class="ranking-container">
        <h3 class="text-xl font-semibold mb-3">Classement</h3>
        <div class="overflow-hidden rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière réponse</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let player of playerRankings; let i = index">
                <td class="px-6 py-4 whitespace-nowrap">{{ i + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap font-medium">{{ player.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ player.score }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="player.lastAnswer !== null" 
                        [ngClass]="{'text-green-600': player.lastAnswerCorrect, 'text-red-600': !player.lastAnswerCorrect}">
                    {{ player.lastAnswerText }}
                    <span *ngIf="player.lastAnswerCorrect" class="ml-1">✓</span>
                    <span *ngIf="!player.lastAnswerCorrect" class="ml-1">✗</span>
                  </span>
                  <span *ngIf="player.lastAnswer === null" class="text-gray-400">Pas de réponse</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Bouton pour continuer -->
      <div class="mt-6 text-center">
        <button (click)="continueToNextQuestion()" 
                class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
          Question suivante
        </button>
      </div>
    </div>
  `,
  styles: [`
    .score-container {
      animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ScoreRankingComponent implements OnInit {
  @Input() playerScores: {[playerId: string]: number} = {};
  @Input() currentQuestionData: any;
  @Input() playerAnswers: {[playerId: string]: any} = {};
  @Input() playerDetails: any[] = [];
  @Output() continue = new EventEmitter<void>();
  
  playerRankings: any[] = [];
  questionText: string = '';
  correctAnswerText: string = '';
  
  ngOnInit(): void {
    this.prepareRankingData();
    this.questionText = this.currentQuestionData.question;
    
    // Déterminer le texte de la bonne réponse
    const correctAnswerNum = this.currentQuestionData.correct_answer;
    this.correctAnswerText = this.currentQuestionData[`answer${correctAnswerNum}`];
  }
  
  prepareRankingData(): void {
    // Combiner les données des joueurs avec leurs scores et réponses
    this.playerRankings = this.playerDetails.map(player => {
      const playerId = player.id;
      const score = this.playerScores[playerId] || 0;
      
      // Vérifier si le joueur a répondu à la question actuelle
      const questionId = this.currentQuestionData.id;
      const playerAnswer = this.playerAnswers[questionId]?.[playerId] || null;
      
      let lastAnswer = null;
      let lastAnswerText = '';
      let lastAnswerCorrect = false;
      
      if (playerAnswer) {
        lastAnswer = playerAnswer.answer;
        lastAnswerText = this.currentQuestionData[`answer${lastAnswer}`];
        lastAnswerCorrect = lastAnswer === this.currentQuestionData.correct_answer;
      }
      
      return {
        id: playerId,
        name: player.name,
        score: score,
        lastAnswer: lastAnswer,
        lastAnswerText: lastAnswerText,
        lastAnswerCorrect: lastAnswerCorrect
      };
    });
    
    // Trier par score (décroissant)
    this.playerRankings.sort((a, b) => b.score - a.score);
  }
  
  continueToNextQuestion(): void {
    this.continue.emit();
  }
}