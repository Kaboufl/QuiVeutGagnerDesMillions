import { computed, Injectable } from "@angular/core";
import { SocketService } from "./Socket.service";
import Player from "../models/player";
import { Observable, tap } from "rxjs";
import { DataService } from "./Data.service";
import Question from "../models/question";

@Injectable({
    providedIn: 'root'
})
export class GameService {

    public lobbyId: string = '';
    public players: Player[] = [];
    public isMaster: boolean = false;
    public master!: Player;
    public player = computed(() => this.players.find(player => player.username === this.username));
    
    public questions: Question[] = [];
    public currentQuestionIndex: number = 0;
    public currentQuestion = computed(() => this.questions[this.currentQuestionIndex]);

    public username: string = '';

    constructor(
        private socketService: SocketService,
        private apiService: DataService
    ) { }

    createLobby(): Observable<any> {
        return this.apiService.requestLobby()
            .pipe(
                tap(data => {
                    console.log("Create lobby data:", data)
                    this.lobbyId = data.lobbyId
                })
            )
    }

    joinLobby(lobbyId: string, username: string): Observable<any> {
        this.username = username;
        return this.socketService.joinLobby(lobbyId, username)
            .pipe(tap(data => {
                this.players = data.players
                    .filter((player: Player) => !player.is_master)
                    .map((player: Player) => {
                        player.answers = [];
                        return player;
                    });
                this.master = data.players.find((player: Player) => player.is_master)
                this.isMaster = this.master.username === username;
            }
        ))
    }

    startGame(): Observable<any> {
        if (!this.lobbyId) {
            throw new Error('Aucune salle de jeu n\'est définie.');
        }
        if (this.isMaster) {
            console.log('Player is master, he listens for other players answers');
            this.listenForAnswer().subscribe();
        }
        return this.apiService.startGame(this.lobbyId)
            .pipe(
                tap(response => {
                    // console.log('Jeu démarré avec succès:', response);
                })
            );
    }

    listenToGameStart(): Observable<any> {
        return this.socketService.listenToGameStarted()
            .pipe(
                tap(data => {
                    this.questions = data.questions
                    console.log('Le jeu a commencé ! ', data);
                })
            )
    }

    answerQuestion(answer: number): Observable<any> {
        return this.socketService.answerQuestion(this.currentQuestion().id, answer);
    }
    
    listenForAnswer(): Observable<any> {
        return this.socketService.listenForAnswers()
            .pipe(
                tap(data => {
                    console.log('Réponse reçue : ', data);
                    this.players.find(player => player.user_identifier === data.player)?.answers.push(data.answer);
                    console.log(this.players);
                })
            )
    }

    disconnect() {
        this.socketService.disconnect()
    }

    listenToRoomClosed(): Observable<any> {
        return this.socketService.listenToRoomClosed()
            .pipe(tap(x => console.log(x)))
    }
}