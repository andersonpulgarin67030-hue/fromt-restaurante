import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComidaService } from '../services/comida.service';
import { CarritoService } from '../services/carrito.service';
import { Producto } from '../entidades/producto';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.component.html',
  styleUrls: ['./comidas.component.css']
})
export class ComidasComponent implements OnInit {
  listaComidas: Producto[] = [];
  comidasFiltradas: Producto[] = [];
  
  busquedaComida: string = '';
  busquedaIngrediente: string = '';
  cargando: boolean = true;

  constructor(
    private comidaService: ComidaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarComidas();
  }

  cargarComidas(): void {
    this.cargando = true;
    this.comidaService.recibirDatos().subscribe({
      next: (data) => {
        if (data && data.meals) {
          this.listaComidas = data.meals.map((meal: any) => {
            const prod = new Producto();
            prod.id = meal.idMeal;
            prod.nombre = meal.strMeal;
            prod.precio = '$35.000';
            prod.img = meal.strMealThumb;
            prod.tipo = 'comida';
            prod.desc = meal.strInstructions 
              ? meal.strInstructions.substring(0, 120) + '...' 
              : 'Plato especial filipino con sabores únicos.';
            
            // Extrae los ingredientes de la API en minúsculas y limpios
            const ingList: string[] = [];
            for (let i = 1; i <= 20; i++) {
              const ingrediente = meal[`strIngredient${i}`];
              if (ingrediente && ingrediente.trim() !== '') {
                ingList.push(ingrediente.trim());
              }
            }
            prod.ingredientes = ingList.join(', ');
            return prod;
          });
          this.comidasFiltradas = [...this.listaComidas];
        }
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  onBusquedaComidaChange(valor: string): void {
    this.busquedaComida = valor;
    this.filtrar();
  }

  onBusquedaIngredienteChange(valor: string): void {
    this.busquedaIngrediente = valor;
    this.filtrar();
  }

  filtrar(): void {
    const termNombre = this.busquedaComida.toLowerCase().trim();
    const termIngrediente = this.busquedaIngrediente.toLowerCase().trim();

    this.comidasFiltradas = this.listaComidas.filter(c => {
      const nombreMatch = !termNombre || c.nombre.toLowerCase().includes(termNombre);
      const ingredienteMatch = !termIngrediente || c.ingredientes.toLowerCase().includes(termIngrediente);
      return nombreMatch && ingredienteMatch;
    });
  }

  agregarAlPedido(comida: Producto): void {
    this.carritoService.agregarItem(comida);
    alert(`¡${comida.nombre} agregada al pedido!`);
  }
}