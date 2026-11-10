import { Injectable } from '@angular/core';

export interface ItemPedido {
  nombre: string;
  precio: string;
  img: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root' // <-- Importante: debe estar disponible globalmente como Singleton
})
export class PedidoService {
  private pedido: ItemPedido[] = [];

  agregarItem(item: ItemPedido): void {
    this.pedido.push(item);
  }

  obtenerPedido(): ItemPedido[] {
    return this.pedido;
  }

  eliminarItem(index: number): void {
    this.pedido.splice(index, 1);
  }

  limpiarPedido(): void {
    this.pedido = [];
  }

  // Convierte precios como '$22.000' a número para sumar el total
  obtenerTotal(): number {
    return this.pedido.reduce((acc, item) => {
      const valorNumerico = parseInt(item.precio.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + valorNumerico;
    }, 0);
  }
}