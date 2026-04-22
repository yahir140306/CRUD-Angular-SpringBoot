import { Component, OnInit } from '@angular/core';
import { Product } from './models/model';
import { ProductService } from './services/product';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

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
  mensaje = '';
  isLoading = false;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.view().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Productos cargados:', this.products);
      },
      error: (error) => {
        this.mensaje = 'Error al cargar productos. Posible error en el backend';
        console.error(error);
      },
    });
  }

  save(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    if (this.editId !== null) {
      this.productService
        .update(this.editId, this.formulario)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (productoActualizado) => {
            this.products = this.products.map((p) =>
              p.id === this.editId ? productoActualizado : p,
            );
            this.mensaje = 'Producto actualizado correctamente';
            this.cleanForm();
            console.log('Producto actualizado:', productoActualizado);
          },
          error: () => {
            this.mensaje = 'Error al actualizar';
            console.error('Error al actualizar producto');
          },
        });
    } else {
      this.productService
        .create(this.formulario)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (productCreate) => {
            this.products = [...this.products, productCreate];
            this.mensaje = 'Producto creado correctamente';
            this.cleanForm();
          },
          error: () => {
            this.mensaje = 'Error al crear producto';
            console.error('Error al crear producto');
          },
        });
    }
  }

  edit(product: Product): void {
    this.editId = product.id ?? null;
    this.formulario = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };

    this.mensaje = '';
  }

  delete(id: number): void {
    if (this.isLoading) return;
    if (!confirm('Seguro de eliminar?')) return;

    this.isLoading = true;
    this.productService
      .delete(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== id);
          this.mensaje = 'Producto eliminado';
          if (this.editId === id) this.cleanForm();
        },
        error: () => {
          this.mensaje = 'Error al eliminar';
        },
      });
  }

  cleanForm(): void {
    this.formulario = {
      name: '',
      price: 0,
      quantity: 0,
    };
    this.editId = null;
    // setTimeout(() => (this.mensaje = ''), 3000);
  }
}
