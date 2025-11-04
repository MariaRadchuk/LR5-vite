// pages/src/types/product.d.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  isPromo?: boolean;
  requiresPrescription?: boolean; 
}

export type Products = Product[];