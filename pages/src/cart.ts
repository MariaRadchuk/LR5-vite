import type { Product } from "./types/product";

// src/cart.ts
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}
interface CartItem extends Product {
  quantity: number;
}

const MAX_QUANTITY = 100;
const $ = (s: string) => document.querySelector(s) as HTMLElement;

class Cart {
  private items: CartItem[] = [];
  private modal = $('.cart-modal');
  private openBtn = $('.header__cart');
  private closeBtn = $('.cart-modal__close');
  private itemsContainer = $('#cart-items');
  private totalElement = $('#cart-total');

  constructor() {
    this.load();
    this.bindUI();
    this.render();
  }

  private bindUI() {
    // Відкрити/закрити модалку
    this.openBtn.addEventListener('click', () => this.open());
    this.closeBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // ✅ кнопка "Продовжити покупки"
    const continueBtn = document.querySelector('.btn--secondary') as HTMLButtonElement;
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.close();
        // якщо користувач не на головній — повернути туди
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      });
    }

    // Делегування на всі кнопки у кошику
    this.itemsContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const id = parseInt(target.dataset.id || '0');
      if (!id) return;

      if (target.dataset.action === 'inc') this.changeQty(id, 1);
      if (target.dataset.action === 'dec') this.changeQty(id, -1);
      if (target.classList.contains('item-remove')) this.remove(id);
    });
  }

  open() {
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleItem(id: number, title: string, price: number, image: string, requiresPrescription: boolean = false) {
  const existing = this.items.find(i => i.id === id);
  if (existing) {
    this.items = this.items.filter(i => i.id !== id);
  } else {
    this.items.push({
      id,
      title,
      price,
      image,
      quantity: 1,
      requiresPrescription
    });
  }
  this.save();
  this.render();
}
  changeQty(id: number, delta: number) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > MAX_QUANTITY) {
      alert(`Максимальна кількість: ${MAX_QUANTITY} шт.`);
      return;
    }

    item.quantity = newQty;
    this.save();
    this.render();
  }

  remove(id: number) {
    this.items = this.items.filter((i) => i.id !== id);
    this.save();
    this.render();
  }

  private render() {
  this.itemsContainer.innerHTML = '';
  let total = 0;

  if (this.items.length === 0) {
    this.itemsContainer.innerHTML = '<p class="empty">Кошик порожній</p>';
    this.totalElement.textContent = '0 ₴';
    return;
  }

  this.items.forEach(item => {
    total += item.price * item.quantity;

    const isMax = item.quantity >= MAX_QUANTITY;
    const plusBtnClass = isMax ? 'disabled' : '';

    this.itemsContainer.insertAdjacentHTML(
      'beforeend',
      `
      <div class="cart-modal__item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}">
        <div class="item-info">
          <h4>${item.title}</h4>
          <p>${item.price} ₴</p>
        </div>
        <div class="item-quantity">
          <button data-id="${item.id}" data-action="dec" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
          <input type="number" 
                 class="qty-input" 
                 min="1" 
                 max="${MAX_QUANTITY}" 
                 value="${item.quantity}" 
                 data-id="${item.id}">
          <button data-id="${item.id}" data-action="inc" class="${plusBtnClass}" ${isMax ? 'disabled' : ''}>+</button>
        </div>
        <button class="item-remove" data-id="${item.id}">×</button>
      </div>`
    );
  });

  this.totalElement.textContent = `${total} ₴`;

  // ✅ Додаємо слухачі для ручного вводу
  this.itemsContainer.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const id = parseInt(target.dataset.id || '0');
      let value = parseInt(target.value);

      if (isNaN(value) || value < 1) value = 1;
      if (value > MAX_QUANTITY) {
        alert(`Максимальна кількість: ${MAX_QUANTITY} шт.`);
        value = MAX_QUANTITY;
      }

      const item = this.items.find(i => i.id === id);
      if (item) {
        item.quantity = value;
        this.save();
        this.render();
      }
    });
  });
}


  private save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  private load() {
    const data = localStorage.getItem('cart');
    if (data) this.items = JSON.parse(data);
  }
}

// ініціалізація
export function initCart() {
  const cart = new Cart();

  // У файлі initCart() — ОНОВЛЕНО
// У файлі cart.ts → initCart()
document.addEventListener('click', (e) => {
  const img = (e.target as HTMLElement).closest('.card__image');
  if (!img) return;

  const card = img.closest('.card') as HTMLElement;
  const id = parseInt(card.dataset.id || Date.now().toString());
  const title = card.querySelector('.card__title')?.textContent || 'Товар';

  const priceEl = card.querySelector('.card__price-new') || card.querySelector('.card__text');
  const price = parseInt(priceEl?.textContent?.replace(' ₴', '') || '0');
  const image = (card.querySelector('img') as HTMLImageElement)?.src || '';

  // ОТРИМУЄМО requiresPrescription
  const requiresPrescription = card.dataset.requiresPrescription === 'true';

  if (requiresPrescription) {
    showPrescriptionAlert();
    return;
  }

  // ПЕРЕДАЄМО В toggleItem
  cart.toggleItem(id, title, price, image, requiresPrescription);
});

// ФУНКЦІЯ ПОВІДОМЛЕННЯ
function showPrescriptionAlert() {
  const alert = document.getElementById('prescription-alert') as HTMLElement;
  if (!alert) return;

  alert.classList.add('open');

  const closeBtn = alert.querySelector('.prescription-alert__close') as HTMLButtonElement;
  const closeHandler = () => {
    alert.classList.remove('open');
    closeBtn.removeEventListener('click', closeHandler);
  };
  closeBtn.addEventListener('click', closeHandler);

  // Закрити при кліку поза
  const overlayHandler = (e: MouseEvent) => {
    if (e.target === alert) {
      alert.classList.remove('open');
      alert.removeEventListener('click', overlayHandler);
    }
  };
  alert.addEventListener('click', overlayHandler);
}
}
