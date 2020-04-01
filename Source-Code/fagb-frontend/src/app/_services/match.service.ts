import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private url: string = 'http://localhost:3000/matchmakingrequestendpoint';

  constructor(private http: HttpClient) { }

  searchMatch(): Observable<any> {
    return this.http.get<any>(this.url);
  }
    
}
