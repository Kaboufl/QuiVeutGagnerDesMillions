import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseURL = 'http://localhost:4200/api';

  constructor(private http: HttpClient) {}

  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseURL}/${endpoint}`);
  }

  requestLobby(): Observable<any> {
    return this.http.post(`${this.baseURL}/request-room`, {});
  }
}
