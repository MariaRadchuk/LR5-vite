// pages/src/main.ts
import './scss/main.scss';
import { initCart } from './cart';
import { renderProducts } from './ts/renderProducts';
import products from './data/products.json'; // ← це об’єкт-модуль
import type { Products } from './types/product';

// ПРИВЕДЕННЯ ДО МАСИВУ
const productsArray = products as unknown as Products;

initCart();

// РЕНДЕР
const promoGrid = document.querySelector('.promos .cards-grid') as HTMLElement | null;
const productsGrid = document.querySelector('.products .cards-grid') as HTMLElement | null;

if (promoGrid) {
  renderProducts(promoGrid, productsArray.slice(0, 3));
}

if (productsGrid) {
  renderProducts(productsGrid, productsArray);
}