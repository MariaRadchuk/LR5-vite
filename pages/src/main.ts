// pages/src/main.ts
import './scss/main.scss';
import { initCart } from './cart';
import { renderProducts } from './ts/renderProducts';
import promoData from './data/promo.json';
import productsData from './data/products.json';
import type { Products } from './types/product';

initCart();

// АКЦІЇ — 7 карток, горизонтальний скрол
const promoGrid = document.querySelector('.promos .cards-grid') as HTMLElement | null;
if (promoGrid) {
  renderProducts(promoGrid, promoData as unknown as Products);
}

// УСІ ТОВАРИ — сітка
const productsGrid = document.querySelector('.products .cards-grid') as HTMLElement | null;
if (productsGrid) {
  renderProducts(productsGrid, productsData as unknown as Products);
}