import { computed, Injectable } from "@angular/core";
import { SocketService } from "./Socket.service";
import Player from "../models/player";
import { Observable, tap } from "rxjs";
import { DataService } from "./Data.service";

@Injectable({
    providedIn: 'root'
})
export class GameService {

    public lobbyId: string = '';
    public players: Player[] = [];
    public master!: Player;
    public player = computed(() => this.players.find(player => player.username === this.username));

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
                    .map((player: Player) => player);
                this.master = data.players.find((player: Player) => player.is_master)
            }
        ))
    }

    startGame(): Observable<any> {
        if (!this.lobbyId) {
            throw new Error('Aucune salle de jeu n\'est définie.');
        }
        console.log()
        return this.apiService.startGame(this.lobbyId)
            .pipe(
                tap(response => {
                    console.log('Jeu démarré avec succès:', response);
                })
            );
    }

    disconnect() {
        this.socketService.disconnect()
    }

    listenToRoomClosed(): Observable<any> {
        return this.socketService.listenToRoomClosed()
            .pipe(tap(x => console.log(x)))
    }
}