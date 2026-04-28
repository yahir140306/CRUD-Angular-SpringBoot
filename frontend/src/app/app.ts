import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { ProductService } from './services/product';
import { FormsModule } from '@angular/forms';
import { Product } from './models/model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private service = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(false);
  saving = signal(false);
  editId = signal<number | null>(null);
  menssage = signal<{ texto: string; tipo: 'ok' | 'error' } | null>(null);

  formulario = signal<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    quantity: 0,
  });

  modEdit = computed(() => this.editId() !== null);

  titleBtnSave = computed(() =>
    this.saving()
      ? this.modEdit()
        ? 'Actualizando...'
        : 'Creando'
      : this.modEdit()
        ? 'Actualizar'
        : 'Crear Producto',
  );

  /*totalProducts = computed(() => this.products().length);
  totalStock = computed(() => this.products().reduce((acc, p) => acc + p.quantity, 0));
  valueInventario = computed(() =>
    this.products().reduce((acc, p) => acc + p.price * p.quantity, 0),
  );*/

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.listar().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
        console.log(data);
      },
      error: () => {
        this.mostrarMensaje('No se pudo conectar al backend', 'error');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    const form = this.formulario();

    if (!form.name.trim() || form.price <= 0 || form.quantity < 0) {
      this.mostrarMensaje('Completa todos los campos correctamente', 'error');
      console.log(form);
      return;
    }

    this.saving.set(true);

    const id = this.editId();

    const operacion$ = id ? this.service.actualizar(id, form) : this.service.crear(form);

    operacion$.subscribe({
      next: (productResponse) => {
        if (id) {
          const id = this.editId();
          this.products.update((lista) => lista.map((p) => (p.id === id ? productResponse : p)));
          this.mostrarMensaje('Producto actualizado', 'ok');
        } else {
          this.products.update((lista) => [...lista, productResponse]);
          this.mostrarMensaje('Producto creado', 'ok');
        }
        this.saving.set(false);
        this.limpiar();
      },
      error: () => {
        this.mostrarMensaje('Error al guardar', 'error');
        this.saving.set(false);
      },
    });
  }

  edit(p: Product): void {
    this.editId.set(p.id!);
    this.formulario.set({ name: p.name, price: p.price, quantity: p.quantity });
    this.limpiarMensaje();
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
    console.log(p);
  }

  delete(p: Product): void {
    if (!confirm(`Eliminar "${p.name}"`)) return;

    const listaAnterior = this.products();
    this.products.update((lista) => lista.filter((x) => x.id !== p.id));

    this.service.eliminar(p.id!).subscribe({
      next: () => this.mostrarMensaje('Producto eliminado', 'ok'),
      error: () => {
        this.products.set(listaAnterior);
        this.mostrarMensaje('Error al eliminar', 'error');
      },
    });
  }

  limpiar(): void {
    this.formulario.set({ name: '', price: 0, quantity: 0 });
    this.editId.set(null);
  }

  actualizarCampo(campo: keyof Omit<Product, 'id'>, valor: string | number): void {
    this.formulario.update((f) => ({ ...f, [campo]: valor }));
  }

  private mostrarMensaje(texto: string, tipo: 'ok' | 'error'): void {
    this.menssage.set({ texto, tipo });
    setTimeout(() => this.menssage.set(null), 3500);
  }

  private limpiarMensaje(): void {
    this.menssage.set(null);
  }
}
