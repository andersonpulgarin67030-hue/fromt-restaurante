import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComidaService, Comida } from '../services/comida.service';
import { CarritoService, ItemCarrito } from '../services/carrito.service';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './comidas.component.html',
  styleUrls: ['./comidas.component.css']
})
export class ComidasComponent implements OnInit {
  busquedaComida: string = '';
  busquedaIngrediente: string = '';
  comidas: Comida[] = [];
  cargando: boolean = true;

  constructor(
    private comidaService: ComidaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarComidasAPI();
  }

  cargarComidasAPI(): void {
    this.cargando = true;
    this.comidaService.recibirDatos().subscribe({
      next: (data) => {
        if (data && data.meals) {
          this.comidas = data.meals.map((meal: any) => ({
            nombre: meal.strMeal,
            precio: '$25.000',
            img: meal.strMealThumb,
            desc: `Plato típico de origen ${meal.strArea || 'Internacional'}.`,
            ingredientes: [meal.strIngredient1, meal.strIngredient2, meal.strIngredient3]
              .filter(i => i && i.trim() !== '')
              .join(', ')
          }));
        } else {
          this.comidas = [];
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al conectar con TheMealDB:', err);
        this.cargando = false;
      }
    });
  }

  get comidasFiltradas(): Comida[] {
    if (!this.comidas) return [];
    return this.comidas.filter(comida => {
      const coincideNombre = comida.nombre.toLowerCase().includes(this.busquedaComida.toLowerCase());
      const coincideIngrediente = comida.ingredientes.toLowerCase().includes(this.busquedaIngrediente.toLowerCase());
      return coincideNombre && coincideIngrediente;
    });
  }

  agregarAlPedido(comida: Comida): void {
    const item: ItemCarrito = {
      nombre: comida.nombre,
      precio: comida.precio,
      img: comida.img,
      tipo: 'comida'
    };
    this.carritoService.agregarItem(item);
    alert(`¡${comida.nombre} fue agregado a tu carrito!`);
  }
}