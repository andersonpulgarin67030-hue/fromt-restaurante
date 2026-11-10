import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComidaService } from '../services/comida.service';
import { BebidaService } from '../services/bebida.service';

export interface CartaJuego {
  id: number;
  nombre: string;
  img: string;
  revelada: boolean;
  emparejada: boolean;
}

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
  cartas: CartaJuego[] = [];
  cartasSeleccionadas: CartaJuego[] = [];
  
  puntos: number = 0;
  record: number = 0;
  cargando: boolean = true;
  bloqueado: boolean = false;

  constructor(
    private comidaService: ComidaService,
    private bebidaService: BebidaService
  ) {}

  ngOnInit(): void {
    const recordGuardado = localStorage.getItem('manila_record');
    if (recordGuardado) {
      this.record = parseInt(recordGuardado, 10);
    }
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.cargando = true;
    this.puntos = 0;
    this.cartasSeleccionadas = [];
    this.bloqueado = false;

    // Obtener datos simultáneos de Comidas y Bebidas
    this.comidaService.recibirDatos().subscribe({
      next: (dataComidas) => {
        this.bebidaService.obtenerBebidasAPI().subscribe({
          next: (dataBebidas) => {
            this.construirTablero(dataComidas?.meals || [], dataBebidas?.drinks || []);
          },
          error: () => this.cargando = false
        });
      },
      error: () => this.cargando = false
    });
  }

  construirTablero(comidasAPI: any[], bebidasAPI: any[]): void {
    // Seleccionamos 4 comidas y 4 bebidas de las respuestas API
    const itemsComidas = comidasAPI.slice(0, 4).map(m => ({ nombre: m.strMeal, img: m.strMealThumb }));
    const itemsBebidas = bebidasAPI.slice(0, 4).map(b => ({ nombre: b.strDrink, img: b.strDrinkThumb }));

    const base8Items = [...itemsComidas, ...itemsBebidas];

    // Duplicamos los 8 items para formar las 16 cartas (8 parejas)
    let mazo: CartaJuego[] = [];
    let contadorId = 1;

    base8Items.forEach(item => {
      mazo.push({ id: contadorId++, nombre: item.nombre, img: item.img, revelada: false, emparejada: false });
      mazo.push({ id: contadorId++, nombre: item.nombre, img: item.img, revelada: false, emparejada: false });
    });

    // Mezclamos aleatoriamente (Shuffle)
    this.cartas = mazo.sort(() => Math.random() - 0.5);
    this.cargando = false;
  }

  seleccionarCarta(carta: CartaJuego): void {
    if (this.bloqueado || carta.revelada || carta.emparejada) return;

    carta.revelada = true;
    this.cartasSeleccionadas.push(carta);

    if (this.cartasSeleccionadas.length === 2) {
      this.verificarPareja();
    }
  }

  verificarPareja(): void {
    this.bloqueado = true;
    const [c1, c2] = this.cartasSeleccionadas;

    if (c1.nombre === c2.nombre) {
      // Coincidencia correcta
      c1.emparejada = true;
      c2.emparejada = true;
      this.puntos += 100;
      this.cartasSeleccionadas = [];
      this.bloqueado = false;

      if (this.puntos > this.record) {
        this.record = this.puntos;
        localStorage.setItem('manila_record', this.record.toString());
      }
    } else {
      // No coinciden: Ocultar tras un breve delay
      setTimeout(() => {
        c1.revelada = false;
        c2.revelada = false;
        this.cartasSeleccionadas = [];
        this.bloqueado = false;
      }, 900);
    }
  }

  darPista(): void {
    if (this.bloqueado || this.cargando) return;
    this.bloqueado = true;

    // Muestra temporalmente todas las cartas por 1 segundo
    this.cartas.forEach(c => c.revelada = true);
    setTimeout(() => {
      this.cartas.forEach(c => {
        if (!c.emparejada) c.revelada = false;
      });
      this.bloqueado = false;
    }, 1000);
  }
}