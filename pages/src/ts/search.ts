// pages/src/ts/search.ts
import type { Products } from '../types/product';
import { renderProducts } from './renderProducts';

// Кеш даних
let allProducts: Products = [];
let promoProducts: Products = [];

// Контейнери
const productsContainer = document.querySelector('.products .cards-grid') as HTMLElement | null;
const promoContainer = document.querySelector('.promos .cards-grid') as HTMLElement | null;

// Секції
const productsSection = document.querySelector('.products') as HTMLElement | null;
const promoSection = document.querySelector('.promos') as HTMLElement | null;

export function initSearch(
  allData: Products,
  promoData: Products
) {
  allProducts = allData;
  promoProducts = promoData;

  const form = document.getElementById('search-form') as HTMLFormElement | null;
  const input = document.getElementById('search-input') as HTMLInputElement | null;

  if (!form || !input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    performSearch(query);
  });

  form.addEventListener('submit', (e) => e.preventDefault());
}

function performSearch(query: string) {
  if (!query) {
    resetAll();
    return;
  }

  const filteredAll = filterAndHighlight(allProducts, query);
  const filteredPromo = filterAndHighlight(promoProducts, query);

  updateSection('products', productsSection, productsContainer, filteredAll, 'Немає товарів за запитом');
  updateSection('promos', promoSection, promoContainer, filteredPromo, 'Немає акційних товарів');
}

function filterAndHighlight(products: Products, query: string): Products {
  return products
    .map(product => {
      const title = product.title.toLowerCase();
      if (!title.includes(query)) return null;

      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      const highlightedTitle = product.title.replace(regex, '<mark>$1</mark>');

      return { ...product, title: highlightedTitle };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

function updateSection(
  type: 'products' | 'promos',
  section: HTMLElement | null,
  container: HTMLElement | null,
  items: Products,
  emptyMessage: string
) {
  if (!section || !container) return;

  // Очищаємо
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `<p class="search-empty">${emptyMessage}</p>`;
  } else {
    renderProducts(container, items);
  }

  // Показуємо секцію
  section.style.display = 'block';

  // Приховуємо, якщо нічого не знайдено і є результати в іншій секції
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
  const hasQuery = searchInput?.value.trim();

  if (!hasQuery) return;

  const otherContainer = type === 'products' ? promoContainer : productsContainer;
  const hasOtherResults = otherContainer && otherContainer.children.length > 0 && 
                          !otherContainer.querySelector('.search-empty');

  if (items.length === 0 && hasOtherResults) {
    section.style.display = 'none';
  }
}

function resetAll() {
  if (productsContainer) renderProducts(productsContainer, allProducts);
  if (promoContainer) renderProducts(promoContainer, promoProducts);
  if (productsSection) productsSection.style.display = 'block';
  if (promoSection) promoSection.style.display = 'block';
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}