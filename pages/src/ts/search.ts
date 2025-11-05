// src/ts/search.ts
import type { Products } from '../types/product';
import { renderProducts } from './renderProducts';

// Кеш даних
let allProducts: Products = [];
let promoProducts: Products = [];

// Контейнери
const productsContainer = document.querySelector('.products .cards-grid') as HTMLElement | null;
const promoContainer = document.querySelector('.promos .cards-grid') as HTMLElement | null;

export function initSearch(
  allData: Products,
  promoData: Products
) {
  allProducts = allData;
  promoProducts = promoData;

  const form = document.getElementById('search-form') as HTMLFormElement;
  const input = document.getElementById('search-input') as HTMLInputElement;

  if (!form || !input) return;

  // Пошук при вводі
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    performSearch(query);
  });

  // Запобігаємо submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });
}

function performSearch(query: string) {
  if (!query) {
    // Повертаємо все
    if (productsContainer) renderProducts(productsContainer, allProducts);
    if (promoContainer) renderProducts(promoContainer, promoProducts);
    return;
  }

  // Фільтр + підсвітка
  const filteredAll = allProducts
    .map(product => highlightMatch(product, query))
    .filter(p => p !== null) as Products;

  const filteredPromo = promoProducts
    .map(product => highlightMatch(product, query))
    .filter(p => p !== null) as Products;

  if (productsContainer) renderProducts(productsContainer, filteredAll);
  if (promoContainer) renderProducts(promoContainer, filteredPromo);
}

function highlightMatch(product: any, query: string): any | null {
  const title = product.title.toLowerCase();
  if (!title.includes(query)) return null;

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const highlightedTitle = product.title.replace(regex, '<mark>$1</mark>');

  return {
    ...product,
    title: highlightedTitle
  };
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}