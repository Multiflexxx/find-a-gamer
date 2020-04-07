import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Language } from '../data_objects/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private url: string = 'http://localhost:3000/languagesendpoint';

  constructor(private http: HttpClient) { }

  getLanguage(): Observable<Language[]> {
    return this.http.get<Language[]>(this.url);
  }

}
