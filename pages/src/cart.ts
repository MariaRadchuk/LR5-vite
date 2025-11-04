// src/cart.ts
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

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

  toggleItem(id: number, title: string, price: number, image: string) {
    const existing = this.items.find((i) => i.id === id);
    if (existing) {
      this.items = this.items.filter((i) => i.id !== id);
    } else {
      this.items.push({ id, title, price, image, quantity: 1 });
    }
    this.save();
    this.render();
  }

  changeQty(id: number, delta: number) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      this.save();
      this.render();
    }
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
      this.itemsContainer.innerHTML =
        '<p class="empty">Кошик порожній</p>';
      this.totalElement.textContent = '0 ₴';
      return;
    }

    this.items.forEach((item) => {
      total += item.price * item.quantity;
      this.itemsContainer.insertAdjacentHTML(
        'beforeend',
        `
        <div class="cart-modal__item">
          <img src="${item.image}" alt="${item.title}">
          <div class="item-info">
            <h4>${item.title}</h4>
            <p>${item.price} ₴</p>
          </div>
          <div class="item-quantity">
            <button data-id="${item.id}" data-action="dec">−</button>
            <span>${item.quantity}</span>
            <button data-id="${item.id}" data-action="inc">+</button>
          </div>
          <button class="item-remove" data-id="${item.id}">×</button>
        </div>`
      );
    });

    this.totalElement.textContent = `${total} ₴`;
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
document.addEventListener('click', (e) => {
  const img = (e.target as HTMLElement).closest('.card__image');
  if (img) {
    const card = img.closest('.card') as HTMLElement;
    const id = parseInt(card.dataset.id || Date.now().toString());
    const title = card.querySelector('.card__title')?.textContent || 'Товар';

    // БЕРЕМО НОВУ ЦІНУ — З .card__price-new АБО .card__text
    const newPriceEl = card.querySelector('.card__price-new');
    const priceTextEl = card.querySelector('.card__text');
    const price = newPriceEl
      ? parseInt(newPriceEl.textContent!.replace(' ₴', ''))
      : parseInt(priceTextEl?.textContent!.replace(' ₴', '') || '0');

    const image = (card.querySelector('img') as HTMLImageElement)?.src || '';

    cart.toggleItem(id, title, price, image); // НОВА ЦІНА!
  }
});
}
