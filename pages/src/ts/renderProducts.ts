// pages/src/ts/renderProducts.ts  рендер (малювання) карток 
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

    // напис "акція" на картках 
    const promoBadge = product.isPromo
      ? '<div class="card__badge">Акція</div>'
      : '';

    // ЦІНА: стара + нова 
    const priceHTML = product.isPromo && product.oldPrice
      ? `
        <p class="card__price">
          <span class="card__price-old">${product.oldPrice} ₴</span>
          <span class="card__price-new">${product.price} ₴</span>
        </p>
      `
      : `<p class="card__text">${product.price} ₴</p>`;

    // розмітка картки
card.innerHTML = `
  <div class="card__image">
    ${promoBadge}
    <img src="${product.image}" alt="${product.title.replace(/<[^>]*>/g, '')}">
  </div>
  <div class="card__body">
    <h3 class="card__title">${product.title}</h3>
    ${priceHTML}
  </div>
`;

    container.appendChild(card);
  });
}