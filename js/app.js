/**
 * Aplicação Principal - Página Setorial FAMINAS
 * Extensão Universitária • Engenharia de Software • ADS
 */

import { initModalController } from './modal-controller.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o gerenciador de modais institucionais (Sobre, Termos, Privacidade)
  initModalController();

  console.log('[InfoHub Setorial] Template institucional inicializado com sucesso.');
/* ==========================================================================
   Mapa interativo do complexo esportivo
   Ao clicar (ou usar Enter/Espaço) em uma área, mostra a explicação dela.
   Clicar de novo na mesma área fecha a explicação.
   Sem JavaScript, todas as explicações continuam visíveis na página.
   ========================================================================== */

const root = document.querySelector('[data-mapa]');

if (root) {
  const zones = root.querySelectorAll('.map-zone');
  const cards = root.querySelectorAll('[data-zone-info]');
  const intro = root.querySelector('[data-zone-intro]');

  function show(id) {
    cards.forEach((card) => {
      card.hidden = card.dataset.zoneInfo !== id;
    });
    intro.hidden = id !== null;

    zones.forEach((zone) => {
      const active = zone.dataset.zone === id;
      zone.setAttribute('aria-pressed', String(active));
      zone.classList.toggle('is-active', active);
    });
  }

  let current = null;

  zones.forEach((zone) => {
    zone.addEventListener('click', () => {
      current = current === zone.dataset.zone ? null : zone.dataset.zone;
      root.classList.add('is-explored'); // para de piscar a dica nas etiquetas
      show(current);
    });
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && current !== null) {
      current = null;
      show(null);
    }
  });

  show(null);
}


/* ==========================================================================
   Animações de entrada (ao rolar a página)
   Só ativam se o navegador permitir movimento. Sem JavaScript, ou com
   "reduzir movimento" ligado no sistema, o conteúdo aparece direto, sem animar.
   ========================================================================== */

const featuresSection = document.querySelector('#features');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (featuresSection && !prefersReducedMotion && 'IntersectionObserver' in window) {
  featuresSection.classList.add('js-anim');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
  );

  featuresSection
    .querySelectorAll('.scoreboard, .q-block, .contact-banner')
    .forEach((el) => observer.observe(el));
}


/* ==========================================================================
   Carrossel da galeria
   Usa rolagem nativa com encaixe (funciona com toque e com o dedo).
   Botões, bolinhas e teclado só aparecem/funcionam com JavaScript ligado.
   ========================================================================== */

function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const dotsBox = carousel.querySelector('.carousel-dots');
  const status = carousel.querySelector('.carousel-status');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;

  function goTo(i, behavior) {
    const target = (i + slides.length) % slides.length;
    track.scrollTo({
      left: target * track.clientWidth,
      behavior: behavior || (reduceMotion ? 'auto' : 'smooth'),
    });
  }

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Ir para a foto ${i + 1} de ${slides.length}`);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  function update() {
    index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
    status.textContent = `Foto ${index + 1} de ${slides.length}`;
  }

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  });

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    }
  });

  // Mantém a foto atual alinhada se a tela mudar de tamanho
  window.addEventListener('resize', () => goTo(index, 'auto'));

  prev.hidden = false;
  next.hidden = false;
  dotsBox.hidden = false;
  update();
}

initCarousel();
});
