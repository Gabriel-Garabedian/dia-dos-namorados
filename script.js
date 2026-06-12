/* ═══════════════════════════════════════════════════════
   VICTORIA & GABRIEL — Nossa História
   script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────
   CONFIGURAÇÃO — Edite aqui os dados pessoais
   ──────────────────────────────────────────────────────
   Datas no formato: new Date(ano, mês-1, dia, hora, minuto)
   Meses: 0 = Jan, 1 = Fev, ..., 11 = Dez
   ────────────────────────────────────────────────────── */
const CONFIG = {
  // Data de início do relacionamento (usado no contador)
  startDate: new Date(2024, 0, 1, 0, 0), // 01/01/2024

  // Motivos aleatórios
  randomReasons: [
    'Porque ao seu lado, eu sou a melhor versão de mim mesmo.',
    'Porque o seu sorriso é a coisa mais bonita que eu já vi na vida.',
    'Porque você me faz querer crescer e ser melhor todo dia.',
    'Porque a primeira vez que te vi no RioMar, eu soube que era você.',
    'Porque você dorme aqui e o lugar fica diferente — mais quente.',
    'Porque nossa viagem de fevereiro mostrou que o mundo é mais bonito com você.',
    'Porque você é a pessoa com quem eu quero dividir cada novidade.',
    'Porque quando estou com você, o tempo passa diferente.',
    'Porque o nosso Natal juntos foi um dos melhores momentos da minha vida.',
    'Porque você me escuta de um jeito que pouquíssimas pessoas sabem.',
    'Porque você é corajosa, e isso me inspira toda vez.',
    'Porque a gente tem histórias que só nós dois sabemos.',
    'Porque você faz questão de estar presente, de verdade.',
    'Porque te escolher nunca foi difícil — e eu escolho toda vez.',
    'Porque você transforma lugares comuns em memórias inesquecíveis.',
  ],

  // Cores dos confetes
  confettiColors: ['#F2C4CE', '#C9A84C', '#8B3A52', '#FFFFFF', '#E8D5A3'],
};

/* ══════════════════════════════════════════════════════
   MÓDULO: LOADER
   ══════════════════════════════════════════════════════ */
const Loader = (() => {
  const loader = document.getElementById('loader');

  function hide() {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove do DOM após a animação
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1600);
  }

  function init() {
    hide();
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: PARTÍCULAS (corações flutuantes no canvas)
   ══════════════════════════════════════════════════════ */
const Particles = (() => {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  const isDark = () => document.body.dataset.theme === 'dark';

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 10 + 6,
      speed: Math.random() * 0.6 + 0.2,
      opacity: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    };
  }

  function drawHeart(x, y, size, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = isDark() ? '#8B3A52' : '#F2C4CE';
    ctx.beginPath();
    const s = size / 14;
    ctx.moveTo(0, -s * 3);
    ctx.bezierCurveTo( s * 5, -s * 8,  s * 10, -s * 3,  0,  s * 4);
    ctx.bezierCurveTo(-s * 10, -s * 3, -s * 5, -s * 8,  0, -s * 3);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adicionar nova partícula aleatoriamente
    if (Math.random() < 0.04 && particles.length < 40) {
      particles.push(createParticle());
    }

    particles = particles.filter(p => {
      p.y -= p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;
      if (p.y < -30) return false;
      drawHeart(p.x, p.y, p.size, p.opacity, p.rotation);
      return true;
    });

    animId = requestAnimationFrame(tick);
  }

  function init() {
    resize();
    window.addEventListener('resize', resize);

    // Respeitar preferência de movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    tick();
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: CONTADOR DE TEMPO
   ══════════════════════════════════════════════════════ */
const Counter = (() => {
  const els = {
    years:   document.getElementById('c-years'),
    months:  document.getElementById('c-months'),
    days:    document.getElementById('c-days'),
    hours:   document.getElementById('c-hours'),
    minutes: document.getElementById('c-minutes'),
  };

  function calculate() {
    const now   = new Date();
    const start = CONFIG.startDate;

    let years  = now.getFullYear() - start.getFullYear();
    let months = now.getMonth()    - start.getMonth();
    let days   = now.getDate()     - start.getDate();
    let hours  = now.getHours()    - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();

    if (minutes < 0) { minutes += 60; hours--; }
    if (hours   < 0) { hours   += 24; days--;  }
    if (days    < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months  < 0) { months  += 12; years--; }

    return { years, months, days, hours, minutes };
  }

  function animateNumber(el, target) {
    const duration = 1200;
    const start    = performance.now();
    const from     = parseInt(el.textContent) || 0;

    function step(ts) {
      const progress = Math.min((ts - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (target - from) * ease);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function update() {
    const { years, months, days, hours, minutes } = calculate();
    animateNumber(els.years,   years);
    animateNumber(els.months,  months);
    animateNumber(els.days,    days);
    animateNumber(els.hours,   hours);
    animateNumber(els.minutes, minutes);
  }

  function init() {
    update();
    // Atualizar a cada minuto
    setInterval(update, 60000);
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: REVEAL AO ROLAR (Intersection Observer)
   ══════════════════════════════════════════════════════ */
const Reveal = (() => {
  function init() {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(t => observer.observe(t));
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: GALERIA & LIGHTBOX
   ══════════════════════════════════════════════════════ */
const Gallery = (() => {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const closeBtn    = document.getElementById('lightbox-close');
  const items       = document.querySelectorAll('.gallery-item');

  function open(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption || '';
    lightboxCap.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    items.forEach(item => {
      // Adicionar legenda ao hover
      const caption = item.dataset.caption;
      if (caption) {
        const capEl = document.createElement('div');
        capEl.className = 'gallery-caption';
        capEl.textContent = caption;
        item.appendChild(capEl);
      }

      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          open(img.src, caption);
        }
      });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: CARDS DE RAZÕES (flip)
   ══════════════════════════════════════════════════════ */
const Reasons = (() => {
  function init() {
    const cards = document.querySelectorAll('.reason-card');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });

      // Acessibilidade
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: CARROSSEL DE FRASES
   ══════════════════════════════════════════════════════ */
const Carousel = (() => {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  let current  = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    interval = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(interval);
    startAuto();
  }

  function init() {
    if (!slides.length) return;

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    });

    // Swipe no mobile
    let touchStartX = 0;
    const track = document.getElementById('carousel-track');
    if (track) {
      track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
      });
    }

    startAuto();
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: PLAYLIST
   ══════════════════════════════════════════════════════ */
const Playlist = (() => {
  const items      = document.querySelectorAll('.track-item');
  const songName   = document.getElementById('player-song-name');
  const artistName = document.getElementById('player-artist');
  const disc       = document.getElementById('player-disc');

  function activate(item) {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    songName.textContent   = item.dataset.song;
    artistName.textContent = item.dataset.artist;
    disc.classList.add('playing');
  }

  function init() {
    items.forEach(item => {
      item.addEventListener('click', () => activate(item));
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: CÁPSULA DO TEMPO
   ══════════════════════════════════════════════════════ */
const Capsule = (() => {
  const btn    = document.getElementById('capsule-btn');
  const closed = document.getElementById('capsule-closed');
  const open   = document.getElementById('capsule-open');
  const box    = document.getElementById('capsule-box');

  function init() {
    if (!btn) return;

    btn.addEventListener('click', () => {
      box.classList.add('opening');
      setTimeout(() => {
        closed.style.display = 'none';
        open.hidden = false;
      }, 600);
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: MOTIVO ALEATÓRIO
   ══════════════════════════════════════════════════════ */
const RandomReason = (() => {
  const btn  = document.getElementById('random-btn');
  const text = document.getElementById('random-text');
  let lastIndex = -1;

  function pick() {
    let idx;
    do {
      idx = Math.floor(Math.random() * CONFIG.randomReasons.length);
    } while (idx === lastIndex && CONFIG.randomReasons.length > 1);
    lastIndex = idx;
    return CONFIG.randomReasons[idx];
  }

  function init() {
    if (!btn) return;

    btn.addEventListener('click', () => {
      text.classList.add('fading');
      setTimeout(() => {
        text.textContent = pick();
        text.classList.remove('fading');
      }, 400);
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: SURPRESA
   ══════════════════════════════════════════════════════ */
const Surprise = (() => {
  const btn     = document.getElementById('surprise-btn');
  const message = document.getElementById('surprise-message');

  function init() {
    if (!btn) return;

    btn.addEventListener('click', () => {
      btn.textContent = 'Boa, você clicou 😄';
      btn.style.borderColor = 'var(--wine)';
      message.hidden = false;
      message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: TEMA CLARO / ESCURO
   ══════════════════════════════════════════════════════ */
const Theme = (() => {
  const btn  = document.getElementById('theme-toggle');
  const body = document.body;

  function apply(theme) {
    body.dataset.theme = theme;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Tema claro' : 'Tema escuro');
    btn.textContent = theme === 'dark' ? '○' : '◐';
    localStorage.setItem('vg-theme', theme);
  }

  function toggle() {
    apply(body.dataset.theme === 'dark' ? 'light' : 'dark');
  }

  function init() {
    const saved = localStorage.getItem('vg-theme');
    if (saved) {
      apply(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      apply('dark');
    }
    btn.addEventListener('click', toggle);
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: MÚSICA AMBIENTE
   ══════════════════════════════════════════════════════ */
const MusicControl = (() => {
  const btn   = document.getElementById('music-toggle');
  const audio = document.getElementById('ambient-audio');
  let playing = false;

  function init() {
    if (!btn) return;

    // Apenas mostra o botão se houver source de áudio
    const hasSrc = audio.querySelector('source');
    if (!hasSrc) {
      btn.title = 'Adicione um arquivo de áudio no HTML para ativar a música';
    }

    btn.addEventListener('click', () => {
      if (!hasSrc) {
        btn.classList.add('ctrl-btn--disabled');
        return;
      }
      if (playing) {
        audio.pause();
        btn.textContent = '♪';
        btn.setAttribute('aria-label', 'Tocar música');
      } else {
        audio.play().catch(() => {});
        btn.textContent = '⏸';
        btn.setAttribute('aria-label', 'Pausar música');
      }
      playing = !playing;
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: BOTÃO VOLTAR AO TOPO
   ══════════════════════════════════════════════════════ */
const BackToTop = (() => {
  const btn = document.getElementById('back-to-top');

  function init() {
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: SCROLL LINKS
   ══════════════════════════════════════════════════════ */
const ScrollLinks = (() => {
  function init() {
    document.querySelectorAll('a.scroll-link[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: CONFETES (primeira visita)
   ══════════════════════════════════════════════════════ */
const Confetti = (() => {
  function launch() {
    const count  = 60;
    const colors = CONFIG.confettiColors;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.cssText = `
          left: ${Math.random() * 100}vw;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          width: ${Math.random() * 10 + 6}px;
          height: ${Math.random() * 10 + 6}px;
          animation-duration: ${Math.random() * 2 + 2.5}s;
          animation-delay: ${Math.random() * 1}s;
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        `;
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
      }, i * 30);
    }
  }

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const key = 'vg-visited';
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      // Aguarda o loader sumir
      setTimeout(launch, 2000);
    }
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   MÓDULO: EFEITO TYPING no hero subtitle
   ══════════════════════════════════════════════════════ */
const Typing = (() => {
  // Opcionalmente ativa um efeito de cursor piscante na carta
  function init() {
    // Podemos deixar simples: o CSS já faz o fade-up
    // Para um efeito de digitação real na carta:
    const letterBody = document.getElementById('letter-body');
    if (!letterBody) return;

    const paras = Array.from(letterBody.querySelectorAll('p'));
    paras.forEach((p, i) => {
      p.style.opacity    = '0';
      p.style.transform  = 'translateY(12px)';
      p.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
    });

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        paras.forEach(p => {
          p.style.opacity   = '1';
          p.style.transform = 'translateY(0)';
        });
        obs.unobserve(letterBody);
      }
    }, { threshold: 0.1 });

    obs.observe(letterBody);
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════
   INICIALIZAÇÃO GERAL
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Loader.init();
  Theme.init();
  Particles.init();
  Reveal.init();
  Counter.init();
  Gallery.init();
  Reasons.init();
  Carousel.init();
  Playlist.init();
  Capsule.init();
  RandomReason.init();
  Surprise.init();
  MusicControl.init();
  BackToTop.init();
  ScrollLinks.init();
  Confetti.init();
  Typing.init();
});
