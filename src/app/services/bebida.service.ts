import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bebida {
  nombre: string;
  precio: string;
  img: string;
  desc: string;
  ingredientes: string;
  alcoholica: boolean;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class BebidaService {
  private base = 'https://www.thecocktaildb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  // Consulta general de margaritas/cocteles iniciales
  obtenerBebidasAPI(): Observable<any> {
    return this.http.get(`${this.base}search.php?s=margarita`);
  }

  // Filtrar por Alcohol (Alcoholic / Non_Alcoholic)
  filtrarPorAlcohol(tipo: 'Alcoholic' | 'Non_Alcoholic'): Observable<any> {
    return this.http.get(`${this.base}filter.php?a=${tipo}`);
  }

  // Filtrar por Categoría (Ordinary_Drink / Cocktail)
  filtrarPorCategoria(categoria: 'Ordinary_Drink' | 'Cocktail'): Observable<any> {
    return this.http.get(`${this.base}filter.php?c=${categoria}`);
  }
}