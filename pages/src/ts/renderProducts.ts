// pages/src/ts/renderProducts.ts
import type { Products } from '../types/product';
import rawProducts from '../data/products.json';

const products: Products = rawProducts as unknown as Products;

export function renderProducts(container: HTMLElement, items: Products = products) {
  container.innerHTML = '';

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'promos__item';
    card.dataset.id = product.id.toString();

    card.innerHTML = `
      <div class="card">
        <div class="card__image">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="card__body">
          <h3 class="card__title">${product.title}</h3>
          <p class="card__text">${product.price} ₴</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}