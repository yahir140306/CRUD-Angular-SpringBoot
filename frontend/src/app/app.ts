import { Component, OnInit, signal } from '@angular/core';
import { Product } from './models/model';
import { ProductService } from './services/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  products: Product[] = [];

  formulario: Product = {
    name: '',
    price: 0,
    quantity: 0,
  };

  editId: number | null = null;

  mensaje: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.view().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        this.mensaje = 'Error al cargar productos. Posible error en el backend';
        console.error(err);
      },
    });
  }

  save(): void {
    if (this.editId !== null) {
      this.productService.update(this.editId, this.formulario).subscribe({
        next: (data) => {
          this.mensaje = 'Producto actualizado correctamente';
          this.loadProducts();
          this.cleanForm();
        },
        error: (err) => (this.mensaje = 'Error al actualizar'),
      });
    } else {
      this.productService.create(this.formulario).subscribe({
        next: (data) => {
          this.mensaje = 'Producto creado correctamente';
          this.loadProducts();
          this.cleanForm();
        },
        error: (err) => (this.mensaje = 'Error al crear producto'),
      });
    }
  }

  edit(product: Product): void {
    this.editId = product.id!;
    this.formulario = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };

    this.mensaje = '';
  }

  delete(id: number): void {
    if (!confirm('Seguro de eliminar?')) {
      return;
    }

    this.productService.delete(id).subscribe({
      next: (data) => {
        this.mensaje = 'Producto eliminado';
        this.loadProducts();
      },
      error: (err) => (this.mensaje = 'Error al eliminar'),
    });
  }

  cleanForm(): void {
    this.formulario = {
      name: '',
      price: 0,
      quantity: 0,
    };
    this.editId = null;
    setTimeout(() => (this.mensaje = ''), 3000);
  }
}
