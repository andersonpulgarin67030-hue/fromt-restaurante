import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';
import { Producto } from '../entidades/producto';
import { Cliente } from '../entidades/cliente';
import { Pedido } from '../entidades/pedido';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  items: Producto[] = [];
  cliente: Cliente = new Cliente();
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

    if (!this.cliente.nombre.trim()) {
      alert('Por favor ingresa tu nombre para procesar la orden.');
      return;
    }

    // Instanciamos el pedido formal
    const nuevoPedido = new Pedido();
    nuevoPedido.cliente = this.cliente;
    nuevoPedido.productos = this.items;
    nuevoPedido.total = this.carritoService.obtenerTotal();
    nuevoPedido.metodoPago = this.metodoPago;

    // Genera el PDF con la factura
    this.carritoService.generarFacturaPDF(this.cliente);

    alert(`¡Gracias por tu compra, ${this.cliente.nombre}! Tu comprobante en PDF se ha descargado.`);
    this.carritoService.limpiarCarrito();
    this.cliente = new Cliente();
  }
}