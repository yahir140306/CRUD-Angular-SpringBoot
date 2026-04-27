export interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

export type ProductForm = Omit< Product, 'id'>
