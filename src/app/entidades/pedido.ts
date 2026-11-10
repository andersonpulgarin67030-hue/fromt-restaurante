import { Cliente } from './cliente';
import { Producto } from './producto';

export class Pedido {
  id?: string;
  cliente: Cliente = new Cliente();
  productos: Producto[] = [];
  total: number = 0;
  metodoPago: string = 'efectivo';
  fecha?: Date;
}