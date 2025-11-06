// src/ts/scrollTop.ts скрол на акціях 
export function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top') as HTMLButtonElement | null;
  if (!btn) return;

  // Показати/сховати кнопку
  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  };
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggle);
  toggle();
}