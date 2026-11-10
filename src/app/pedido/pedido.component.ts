import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService, ItemCarrito } from '../services/carrito.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  items: ItemCarrito[] = [];
  nombreCliente: string = '';
  direccion: string = '';
  telefono: string = '';
  metodoPago: string = 'efectivo';

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.items$.subscribe(itemsActuales => {
      this.items = itemsActuales;
    });
  }

  eliminarProducto(index: number): void {
    this.carritoService.eliminarItem(index);
  }

  obtenerTotal(): string {
    const total = this.carritoService.obtenerTotal();
    return `$${total.toLocaleString('es-CO')}.000`;
  }

  confirmarPedido(): void {
    if (this.items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    if (!this.nombreCliente.trim()) {
      alert('Por favor ingresa tu nombre para procesar la orden.');
      return;
    }

    // Genera el PDF con la factura
    this.carritoService.generarFacturaPDF(this.nombreCliente);

    alert(`¡Gracias por tu compra, ${this.nombreCliente}! Tu comprobante en PDF se ha descargado.`);
    this.carritoService.limpiarCarrito();
    this.nombreCliente = '';
    this.direccion = '';
    this.telefono = '';
  }
}