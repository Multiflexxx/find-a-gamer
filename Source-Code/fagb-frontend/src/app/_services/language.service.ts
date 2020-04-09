import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Language } from '../data_objects/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private url: string = '/languagesendpoint';

  public constructor(private http: HttpClient) { }

  public getLanguage(): Observable<Language[]> {
    return this.http.get<Language[]>(this.url);
  }

}
