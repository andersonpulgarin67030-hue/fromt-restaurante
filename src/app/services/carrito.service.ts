import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ItemCarrito {
  nombre: string;
  precio: string; // Ej: "$25.000"
  img: string;
  tipo: 'comida' | 'bebida';
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);
  items$ = this.itemsSubject.asObservable();

  agregarItem(item: ItemCarrito): void {
    const actuales = this.itemsSubject.value;
    this.itemsSubject.next([...actuales, item]);
  }

  obtenerCarrito(): ItemCarrito[] {
    return this.itemsSubject.value;
  }

  eliminarItem(index: number): void {
    const actuales = [...this.itemsSubject.value];
    actuales.splice(index, 1);
    this.itemsSubject.next(actuales);
  }

  limpiarCarrito(): void {
    this.itemsSubject.next([]);
  }

  obtenerTotal(): number {
    return this.itemsSubject.value.reduce((acc, item) => {
      const valorNum = parseInt(item.precio.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + valorNum;
    }, 0);
  }

  generarFacturaPDF(nombreCliente: string = 'Cliente MANILA'): void {
    const items = this.obtenerCarrito();
    if (items.length === 0) return;

    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-CO');
    const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    // Encabezado
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 204, 0);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MANILA RESTAURANTE', 14, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sabores auténticos de Filipinas & Café', 14, 30);

    // Datos del cliente
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.text(`Cliente: ${nombreCliente}`, 14, 50);
    doc.text(`Fecha: ${fecha} - ${hora}`, 14, 56);
    doc.text(`N° Pedido: #MNL-${Math.floor(100000 + Math.random() * 900000)}`, 14, 62);

    // Tabla
    const filasTabla = items.map(item => [
      item.nombre,
      item.tipo.toUpperCase(),
      '1',
      item.precio
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Producto / Item', 'Tipo', 'Cant.', 'Precio']],
      body: filasTabla,
      headStyles: {
        fillColor: [255, 204, 0],
        textColor: [17, 17, 17],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 14, right: 14 }
    });

    const totalFormateado = `$${this.obtenerTotal().toLocaleString('es-CO')}.000`;
    const posFinalY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(`TOTAL PAGADO: ${totalFormateado}`, 14, posFinalY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('¡Salamat! (Gracias por tu compra en MANILA)', 14, posFinalY + 12);

    doc.save(`Recibo_MANILA_${Date.now()}.pdf`);
  }
}