export class Producto {
  id?: string;
  nombre: string = '';
  precio: string = '';
  img: string = '';
  tipo: 'comida' | 'bebida' = 'comida';
  desc: string = '';
  ingredientes: string = '';
  alcoholica: boolean = false;
  categoria: string = '';
}