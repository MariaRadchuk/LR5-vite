// // src/cart.ts
// interface CartItem {
//   id: number;
//   title: string;
//   price: number;
//   image: string;
//   quantity: number;
// }

// class Cart {
//   private items: CartItem[] = [];
//   private modal = document.querySelector('.cart-modal') as HTMLElement;
//   private openBtn = document.querySelector('.header__cart') as HTMLButtonElement;
//   private closeBtn = document.querySelector('.cart-modal__close') as HTMLButtonElement;
//   private itemsContainer = document.getElementById('cart-items') as HTMLElement;
//   private totalElement = document.getElementById('cart-total') as HTMLElement;

//   constructor() {
//     this.loadFromStorage();
//     this.bindEvents();
//     this.render();
//   }

//   // ОНОВЛЕНИЙ bindEvents() — ДОДАНО "Продовжити покупки"
//   private bindEvents() {
//     this.openBtn.addEventListener('click', () => this.open());
//     this.closeBtn.addEventListener('click', () => this.close());
//     this.modal.addEventListener('click', (e) => {
//       if (e.target === this.modal) this.close();
//     });

//     // КНОПКА "Продовжити покупки" — ДОДАНО ТУТ
//     const continueBtn = document.querySelector('.btn--secondary') as HTMLButtonElement;
//     if (continueBtn) {
//       continueBtn.addEventListener('click', () => {
//         this.close();
//         window.location.href = '/'; // Повернення на головну
//       });
//     }
//   }

//   open() {
//     this.modal.classList.add('open');
//     document.body.style.overflow = 'hidden';
//   }

//   close() {
//     this.modal.classList.remove('open');
//     document.body.style.overflow = '';
//   }

//   addItem(id: number, title: string, price: number, image: string) {
//     const existing = this.items.find(item => item.id === id);
//     if (existing) {
//       existing.quantity++;
//     } else {
//       this.items.push({ id, title, price, image, quantity: 1 });
//     }
//     this.saveToStorage();
//     this.render();
//   }

//   removeItem(id: number) {
//     this.items = this.items.filter(item => item.id !== id);
//     this.saveToStorage();
//     this.render();
//   }

//   updateQuantity(id: number, change: number) {
//     const item = this.items.find(i => i.id === id);
//     if (item) {
//       item.quantity = Math.max(1, item.quantity + change);
//       this.saveToStorage();
//       this.render();
//     }
//   }

//   private render() {
//     this.itemsContainer.innerHTML = '';
//     let total = 0;

//     if (this.items.length === 0) {
//       this.itemsContainer.innerHTML = '<p style="text-align:center; color:#999;">Кошик порожній</p>';
//     } else {
//       this.items.forEach(item => {
//         total += item.price * item.quantity;

//         const el = document.createElement('div');
//         el.className = 'cart-modal__item';
//         el.innerHTML = `
//           <img src="${item.image}" alt="${item.title}">
//           <div class="item-info">
//             <h4>${item.title}</h4>
//             <p>${item.price} ₴</p>
//           </div>
//           <div class="item-quantity">
//             <button data-id="${item.id}" data-action="dec">-</button>
//             <span>${item.quantity}</span>
//             <button data-id="${item.id}" data-action="inc">+</button>
//           </div>
//           <button class="item-remove" data-id="${item.id}">×</button>
//         `;
//         this.itemsContainer.appendChild(el);
//       });
//     }

//     this.totalElement.textContent = `${total} ₴`;

//     // Кнопки +/-
//     document.querySelectorAll('[data-action]').forEach(btn => {
//       btn.addEventListener('click', (e) => {
//         const target = e.target as HTMLElement;
//         const id = parseInt(target.dataset.id!);
//         const action = target.dataset.action!;
//         if (action === 'inc') this.updateQuantity(id, 1);
//         if (action === 'dec') this.updateQuantity(id, -1);
//       });
//     });

//     // Видалення
//     document.querySelectorAll('.item-remove').forEach(btn => {
//       btn.addEventListener('click', (e) => {
//         const id = parseInt((e.target as HTMLElement).dataset.id!);
//         this.removeItem(id);
//       });
//     });
//   }

//   private saveToStorage() {
//     localStorage.setItem('eapteka-cart', JSON.stringify(this.items));
//   }

//   private loadFromStorage() {
//     const data = localStorage.getItem('eapteka-cart');
//     if (data) this.items = JSON.parse(data);
//   }
// }

// // ЕКСПОРТ
// export function initCart() {
//   const cart = new Cart();

//   document.addEventListener('click', (e) => {
//     const target = e.target as HTMLElement;
//     if (target.closest('.card')) {
//       const card = target.closest('.card')!;
//       const title = card.querySelector('.card__title')?.textContent || 'Товар';
//       const price = 299;
//       const image = card.querySelector('img')?.src || '/src/assets/images/placeholder.png';
//       const id = Date.now();

//       cart.addItem(id, title, price, image);
//     }
//   });
// }

// src/cart.ts
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

// ДОПОМІЖНІ ФУНКЦІЇ
function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

class Cart {
  private items: CartItem[] = [];
  private modal = $('.cart-modal')!;
  private openBtn = $('.header__cart') as HTMLButtonElement;
  private closeBtn = $('.cart-modal__close') as HTMLButtonElement;
  private itemsContainer = $('#cart-items')!;
  private totalElement = $('#cart-total')!;

  constructor() {
    this.loadFromStorage();
    this.bindEvents();
    this.render();
    this.updateAllCardIcons();
  }

  private bindEvents() {
    this.openBtn.addEventListener('click', () => this.open());
    this.closeBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    const continueBtn = $('.btn--secondary') as HTMLButtonElement;
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.close();
        window.location.href = '/';
      });
    }
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
    const existing = this.items.find(item => item.id === id);

    if (existing) {
      this.items = this.items.filter(item => item.id !== id);
      this.toggleCardIcon(id, false);
    } else {
      this.items.push({ id, title, price, image, quantity: 1 });
      this.toggleCardIcon(id, true);
    }

    this.saveToStorage();
    this.render();
  }

  updateQuantity(id: number, change: number) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      this.saveToStorage();
      this.render();
    }
  }

  removeItem(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    this.toggleCardIcon(id, false);
    this.saveToStorage();
    this.render();
  }

  private toggleCardIcon(id: number, isInCart: boolean) {
    const card = $(`.card[data-id="${id}"]`);
    if (card) {
      card.classList.toggle('in-cart', isInCart);
    }
  }

  private updateAllCardIcons() {
    this.items.forEach(item => {
      this.toggleCardIcon(item.id, true);
    });
  }

  private render() {
    this.itemsContainer.innerHTML = '';
    let total = 0;

    if (this.items.length === 0) {
      this.itemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin: 20px 0;">Кошик порожній</p>';
    } else {
      this.items.forEach(item => {
        total += item.price * item.quantity;

        const el = document.createElement('div');
        el.className = 'cart-modal__item';
        el.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <div class="item-info">
            <h4>${item.title}</h4>
            <p>${item.price} ₴</p>
          </div>
          <div class="item-quantity">
            <button data-id="${item.id}" data-action="dec">-</button>
            <span>${item.quantity}</span>
            <button data-id="${item.id}" data-action="inc">+</button>
          </div>
          <button class="item-remove" data-id="${item.id}">×</button>
        `;
        this.itemsContainer.appendChild(el);
      });
    }

    this.totalElement.textContent = `${total} ₴`;

    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const id = parseInt(target.dataset.id!);
        const action = target.dataset.action!;
        if (action === 'inc') this.updateQuantity(id, 1);
        if (action === 'dec') this.updateQuantity(id, -1);
      });
    });

    document.querySelectorAll('.item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt((e.target as HTMLElement).dataset.id!);
        this.removeItem(id);
      });
    });
  }

  private saveToStorage() {
    localStorage.setItem('eapteka-cart', JSON.stringify(this.items));
  }

  private loadFromStorage() {
    const data = localStorage.getItem('eapteka-cart');
    if (data) {
      this.items = JSON.parse(data);
    }
  }
}

export function initCart() {
  const cart = new Cart();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const imageContainer = target.closest('.card__image');
    if (imageContainer) {
      const card = imageContainer.closest('.card') as HTMLElement | null;
      if (!card) return;

      const id = parseInt(card.dataset.id!);
      const title = card.querySelector('.card__title')?.textContent || 'Товар';
      const priceElement = card.querySelector('.card__text');
      const price = priceElement ? parseInt(priceElement.textContent!.replace(' ₴', '')) : 0;
      const image = (card.querySelector('img') as HTMLImageElement | null)?.src || '/src/assets/images/placeholder.png';

      cart.toggleItem(id, title, price, image);
    }
  });
}