// src/main.ts
import './scss/main.scss';
import { initCart } from './cart';
import { renderProducts } from './ts/renderProducts';
import { initSearch } from './ts/search';
import promoData from './data/promo.json';
import productsData from './data/products.json';
import type { Products } from './types/product';

initCart();
initSearch(productsData as unknown as Products, promoData as unknown as Products);

// Рендер
const promoGrid = document.querySelector('.promos .cards-grid') as HTMLElement | null;
const productsGrid = document.querySelector('.products .cards-grid') as HTMLElement | null;

if (promoGrid) renderProducts(promoGrid, promoData as unknown as Products);
if (productsGrid) renderProducts(productsGrid, productsData as unknown as Products);