import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BebidaService } from '../services/bebida.service';
import { CarritoService } from '../services/carrito.service';
import { Producto } from '../entidades/producto';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.component.html',
  styleUrls: ['./bebidas.component.css']
})
export class BebidasComponent implements OnInit {
  listaBebidas: Producto[] = [];
  bebidasFiltradas: Producto[] = [];
  
  busquedaBebida: string = '';
  busquedaIngrediente: string = '';
  filtroAlcohol: string = 'todos';
  filtroCategoria: string = 'todas';
  cargando: boolean = true;

  constructor(
    private bebidaService: BebidaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarBebidas();
  }

  cargarBebidas(): void {
    this.cargando = true;
    this.bebidaService.obtenerBebidasAPI().subscribe({
      next: (data) => {
        if (data && data.drinks) {
          this.listaBebidas = data.drinks.map((drink: any) => {
            const prod = new Producto();
            prod.id = drink.idDrink;
            prod.nombre = drink.strDrink;
            prod.precio = '$22.000';
            prod.img = drink.strDrinkThumb;
            prod.tipo = 'bebida';
            prod.desc = drink.strInstructions || 'Deliciosa bebida artesanal preparada con los mejores ingredientes.';
            
            // Extraer hasta 15 ingredientes de TheCocktailDB
            const ingList: string[] = [];
            for (let i = 1; i <= 15; i++) {
              const ingrediente = drink[`strIngredient${i}`];
              if (ingrediente && ingrediente.trim() !== '') {
                ingList.push(ingrediente.trim());
              }
            }
            prod.ingredientes = ingList.join(', ') || 'Hielo, Frutas, Menta';
            
            prod.alcoholica = drink.strAlcoholic === 'Alcoholic';
            prod.categoria = drink.strCategory ? drink.strCategory.toLowerCase() : '';
            return prod;
          });
          this.bebidasFiltradas = [...this.listaBebidas];
        }
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  filtrar(): void {
    const termNombre = this.busquedaBebida.toLowerCase().trim();
    const termIngrediente = this.busquedaIngrediente.toLowerCase().trim();

    this.bebidasFiltradas = this.listaBebidas.filter(b => {
      const coincideNombre = !termNombre || b.nombre.toLowerCase().includes(termNombre);
      const coincideIngrediente = !termIngrediente || b.ingredientes.toLowerCase().includes(termIngrediente);
      
      const coincideAlcohol = this.filtroAlcohol === 'todos' || 
        (this.filtroAlcohol === 'alcohol' && b.alcoholica) || 
        (this.filtroAlcohol === 'sin-alcohol' && !b.alcoholica);

      const coincideCat = this.filtroCategoria === 'todas' || 
        (this.filtroCategoria === 'ordinary' && b.categoria.includes('ordinary')) || 
        (this.filtroCategoria === 'cocktail' && b.categoria.includes('cocktail'));

      return coincideNombre && coincideIngrediente && coincideAlcohol && coincideCat;
    });
  }

  agregarAlPedido(bebida: Producto): void {
    this.carritoService.agregarItem(bebida);
    alert(`¡${bebida.nombre} agregada al pedido!`);
  }
}