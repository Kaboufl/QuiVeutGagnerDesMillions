import { Injectable } from "@angular/core";
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

    constructor(
        private socketService: SocketService,
        private apiService: DataService
    ) { }

    createLobby(): Observable<any> {
        return this.apiService.requestLobby()
            .pipe(
                tap({
                    error: err => console.error(err),
                    next: response => {
                        this.lobbyId = response.roomName;
                        return this.joinLobby(response.roomName).subscribe();
                    }
                })
            )
    }

    joinLobby(lobbyId: string): Observable<any> {
        return this.socketService.joinLobby(lobbyId, 'testUser')
            .pipe(tap(x => console.log(x)))
    }

    disconnect() {
        this.socketService.disconnect()
    }

    listenToRoomClosed(): Observable<any> {
        return this.socketService.listenToRoomClosed()
            .pipe(tap(x => console.log(x)))
    }
}