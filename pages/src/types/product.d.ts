// src/types/product.d.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export type Products = Product[];