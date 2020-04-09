import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GameResponse } from '../data_objects/gameresponse';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private url: string = '/gamesendpoint';
  private compState: number;

  public constructor(private http: HttpClient) { }

  public getGame(): Observable<GameResponse[]> {
    return this.http.get<GameResponse[]>(this.url);
  }

  public setCompState(num: number): void {
    this.compState = num;
  }

  public getCompState(): number {
    return this.compState;
  }
}
