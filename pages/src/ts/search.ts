// pages/src/ts/search.ts
import type { Products } from '../types/product';
import { renderProducts } from './renderProducts';

// Кеш
let allProducts: Products = [];
let promoProducts: Products = [];

// Контейнери
const productsContainer = document.querySelector('.products .cards-grid') as HTMLElement | null;
const promoContainer = document.querySelector('.promos .cards-grid') as HTMLElement | null;
const productsSection = document.querySelector('.products') as HTMLElement | null;
const promoSection = document.querySelector('.promos') as HTMLElement | null;

// НОВЕ: спільний контейнер для повідомлення
const searchEmptyContainer = document.createElement('div');
searchEmptyContainer.className = 'search-empty-container';
searchEmptyContainer.innerHTML = `
  <div class="search-empty-content">
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
    <h3>Нічого не знайдено</h3>
    <p>Спробуйте змінити запит або перевірити написання</p>
  </div>
`;

// Вставляємо після .products (або перед .promos)
const mainContent = document.querySelector('main') || document.body;
mainContent.insertBefore(searchEmptyContainer, promoSection);

export function initSearch(allData: Products, promoData: Products) {
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
  const totalFound = filteredAll.length + filteredPromo.length;

  // СХОВАТИ СЕКЦІЇ
  hideAllSections();

  if (totalFound === 0) {
    showEmptyMessage();
  } else {
    hideEmptyMessage();
    if (filteredAll.length > 0) {
      renderSection(productsSection, productsContainer, filteredAll);
    }
    if (filteredPromo.length > 0) {
      renderSection(promoSection, promoContainer, filteredPromo);
    }
  }
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

function renderSection(section: HTMLElement | null, container: HTMLElement | null, items: Products) {
  if (!section || !container) return;

  container.innerHTML = '';
  renderProducts(container, items);
  section.style.display = 'block';
}

function hideAllSections() {
  if (productsSection) productsSection.style.display = 'none';
  if (promoSection) promoSection.style.display = 'none';
  hideEmptyMessage();
}

function showEmptyMessage() {
  searchEmptyContainer.style.display = 'block';
}

function hideEmptyMessage() {
  searchEmptyContainer.style.display = 'none';
}

function resetAll() {
  hideEmptyMessage();
  if (productsContainer) renderProducts(productsContainer, allProducts);
  if (promoContainer) renderProducts(promoContainer, promoProducts);
  if (productsSection) productsSection.style.display = 'block';
  if (promoSection) promoSection.style.display = 'block';
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}