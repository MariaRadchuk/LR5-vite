// pages/src/ts/renderProducts.ts
import type { Products } from '../types/product';

export function renderProducts(container: HTMLElement, items: Products) {
  container.innerHTML = '';

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = product.id.toString();

    // ДОДАЄМО data-requires-prescription
    if (product.requiresPrescription) {
      card.dataset.requiresPrescription = 'true';
    }

    // БЕЙДЖ АКЦІЇ
    const promoBadge = product.isPromo
      ? '<div class="card__badge">Акція</div>'
      : '';

    // ЦІНА: стара + нова (тільки для акцій)
    const priceHTML = product.isPromo && product.oldPrice
      ? `
        <p class="card__price">
          <span class="card__price-old">${product.oldPrice} ₴</span>
          <span class="card__price-new">${product.price} ₴</span>
        </p>
      `
      : `<p class="card__text">${product.price} ₴</p>`;

    // ОСНОВНА РОЗМІТКА КАРТКИ
    card.innerHTML = `
      <div class="card__image">
        ${promoBadge}
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="card__body">
        <h3 class="card__title">${product.title}</h3>
        ${priceHTML}
      </div>
    `;

    container.appendChild(card);
  });
}