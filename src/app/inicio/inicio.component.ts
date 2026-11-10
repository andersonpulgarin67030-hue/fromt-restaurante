import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ComidaService } from '../services/comida.service';
import { BebidaService } from '../services/bebida.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  comidaEspecial: any = null;
  bebidaEspecial: any = null;
  cargandoEspeciales: boolean = true;

  constructor(
    private comidaService: ComidaService,
    private bebidaService: BebidaService
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidadesAPI();
  }

  cargarEspecialidadesAPI(): void {
    this.cargandoEspeciales = true;

    this.comidaService.recibirDatos().subscribe({
      next: (dataComida) => {
        if (dataComida && dataComida.meals && dataComida.meals.length > 0) {
          const meal = dataComida.meals[0];
          this.comidaEspecial = {
            nombre: meal.strMeal,
            img: meal.strMealThumb,
            desc: `Especialidad de la casa: plato típico de origen ${meal.strArea || 'Internacional'}.`
          };
        }

        this.bebidaService.obtenerBebidasAPI().subscribe({
          next: (dataBebida) => {
            if (dataBebida && dataBebida.drinks && dataBebida.drinks.length > 0) {
              const drink = dataBebida.drinks[0];
              
              let descripcionCorta = 'Refrescante bebida insignia preparada al instante con los mejores ingredientes.';
              if (drink.strCategory) {
                descripcionCorta = `Cóctel insignia de la casa (${drink.strCategory}). Una combinación perfecta de sabor y frescura.`;
              }

              this.bebidaEspecial = {
                nombre: drink.strDrink,
                img: drink.strDrinkThumb,
                desc: descripcionCorta
              };
            }
            this.cargandoEspeciales = false;
          },
          error: () => this.cargandoEspeciales = false
        });
      },
      error: () => this.cargandoEspeciales = false
    });
  }
}