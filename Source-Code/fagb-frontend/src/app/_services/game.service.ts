import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GameResponse } from '../data_objects/gameresponse';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private url: string = 'http://localhost:3000/gamesendpoint';

  constructor(private http: HttpClient) { }

  public getGame(): Observable<GameResponse[]> {
    return this.http.get<GameResponse[]>(this.url);
  }
}
