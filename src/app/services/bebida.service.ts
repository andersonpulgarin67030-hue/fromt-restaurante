import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BebidaService {
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a';

  constructor(private http: HttpClient) {}

  obtenerBebidasAPI(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}