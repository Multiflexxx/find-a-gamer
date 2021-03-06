import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Region } from '../data_objects/region';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private url: string = '/regionendpoint';

  public constructor(private http: HttpClient) { }

  public getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.url);
  }

}
