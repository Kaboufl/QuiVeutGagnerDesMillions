import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './game/lobby/lobby.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    }, {
        path: "game/:lobby_id",
        component: LobbyComponent
    }
];
