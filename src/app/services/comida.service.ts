import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comida {
  nombre: string;
  precio: string;
  img: string;
  desc: string;
  ingredientes: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  private base = 'https://www.themealdb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  recibirDatos(): Observable<any> {
    return this.http.get(`${this.base}search.php?s=chicken`);
  }

  obtenerPlatoEstrella(): Observable<any> {
    return this.http.get(`${this.base}random.php`);
  }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.base}search.php?s=${nombre}`);
  }

  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get(`${this.base}filter.php?i=${ingrediente}`);
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.base}lookup.php?i=${id}`);
  }

  categorias(): Observable<any> {
    return this.http.get(`${this.base}categories.php`);
  }

  comidasPorCategoria(categoria: string): Observable<any> {
    return this.http.get(`${this.base}filter.php?c=${categoria}`);
  }
}