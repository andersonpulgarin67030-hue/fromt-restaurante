import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BebidaService, Bebida } from '../services/bebida.service';
import { CarritoService, ItemCarrito } from '../services/carrito.service';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './bebidas.component.html',
  styleUrls: ['./bebidas.component.css']
})
export class BebidasComponent implements OnInit {
  busquedaBebida: string = '';
  busquedaIngrediente: string = '';
  
  // Nuevos filtros
  filtroAlcohol: string = 'todos'; // 'todos', 'alcohol', 'sin-alcohol'
  filtroCategoria: string = 'todas'; // 'todas', 'ordinary', 'cocktail'

  bebidas: Bebida[] = [];
  cargando: boolean = true;

  constructor(
    private bebidaService: BebidaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarBebidasAPI();
  }

  cargarBebidasAPI(): void {
    this.cargando = true;
    this.bebidaService.obtenerBebidasAPI().subscribe({
      next: (data) => {
        if (data && data.drinks) {
          this.bebidas = data.drinks.map((drink: any) => ({
            nombre: drink.strDrink,
            precio: '$15.000',
            img: drink.strDrinkThumb,
            desc: drink.strInstructions || 'Refrescante bebida de la casa.',
            ingredientes: [drink.strIngredient1, drink.strIngredient2, drink.strIngredient3]
              .filter(i => i && i.trim() !== '')
              .join(', '),
            alcoholica: drink.strAlcoholic === 'Alcoholic',
            categoria: drink.strCategory || 'Cocktail'
          }));
        } else {
          this.bebidas = [];
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al conectar con TheCocktailDB:', err);
        this.cargando = false;
      }
    });
  }

  get bebidasFiltradas(): Bebida[] {
    if (!this.bebidas) return [];

    return this.bebidas.filter(bebida => {
      // 1. Buscador por nombre
      const matchNombre = bebida.nombre.toLowerCase().includes(this.busquedaBebida.toLowerCase());

      // 2. Buscador por ingrediente
      const matchIngrediente = bebida.ingredientes.toLowerCase().includes(this.busquedaIngrediente.toLowerCase());

      // 3. Filtro por alcohol
      let matchAlcohol = true;
      if (this.filtroAlcohol === 'alcohol') {
        matchAlcohol = bebida.alcoholica === true;
      } else if (this.filtroAlcohol === 'sin-alcohol') {
        matchAlcohol = bebida.alcoholica === false;
      }

      // 4. Filtro por categoría (Mapeado a los valores en inglés de la API)
      let matchCat = true;
      if (this.filtroCategoria === 'ordinary') {
        matchCat = bebida.categoria.toLowerCase().includes('ordinary');
      } else if (this.filtroCategoria === 'cocktail') {
        matchCat = bebida.categoria.toLowerCase().includes('cocktail');
      }

      return matchNombre && matchIngrediente && matchAlcohol && matchCat;
    });
  }

  agregarAlPedido(bebida: Bebida): void {
    const item: ItemCarrito = {
      nombre: bebida.nombre,
      precio: bebida.precio,
      img: bebida.img,
      tipo: 'bebida'
    };
    this.carritoService.agregarItem(item);
    alert(`¡${bebida.nombre} fue agregada a tu carrito!`);
  }
}