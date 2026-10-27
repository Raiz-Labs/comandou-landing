// Contato da landing — trocar aqui quando houver número corporativo.
// whatsapp: só dígitos, com DDI e DDD (ex.: '5511999998888').
const CONTATO = {
  whatsapp: '5516991244009',
  mensagem: 'Olá! Quero ver o Comandou funcionando no meu restaurante.',
};

// ponytail: sem número configurado o CTA aponta para a seção de contato, nunca para um link quebrado
const ctaHref = CONTATO.whatsapp
  ? `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(CONTATO.mensagem)}`
  : '#contato';
if (!CONTATO.whatsapp) console.warn('[landing] CONTATO.whatsapp vazio — configure em js/main.js');

document.querySelectorAll('[data-cta]').forEach((a) => {
  a.href = ctaHref;
  if (CONTATO.whatsapp) { a.target = '_blank'; a.rel = 'noopener'; }
});
document.querySelectorAll('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Header ganha vidro + borda ao rolar
const header = document.querySelector('.l-header');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menu mobile (drawer)
const drawer = document.getElementById('menu');
const burger = document.querySelector('.l-burger');
const setMenu = (open) => {
  drawer.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
  if (open) drawer.querySelector('a, button').focus(); else burger.focus();
};
burger.addEventListener('click', () => setMenu(true));
drawer.querySelectorAll('[data-fechar], nav a').forEach((el) => el.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) setMenu(false); });

// Reveal ao rolar (uma vez)
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('is-in');
  io.unobserve(e.target);
}), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-rise]').forEach((el) => io.observe(el));

// Vídeo do hero: loop com o som original.
// Navegadores bloqueiam autoplay com som sem interação do usuário, então: tenta com som;
// se bloquear, toca mudo e o botão "Ativar som" liga o áudio no primeiro clique.
const video = document.querySelector('.l-video video');
if (video) {
  const btnSom = document.querySelector('.l-video__som');
  const btnPlay = document.querySelector('.l-video__toggle');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pausadoPeloUsuario = reduz;

  const icone = (btn, nome) => btn.querySelector('use').setAttribute('href', `#i-${nome}`);
  const syncSom = () => {
    const comSom = !video.muted;
    btnSom.setAttribute('aria-pressed', String(comSom));
    btnSom.setAttribute('aria-label', comSom ? 'Desativar som' : 'Ativar som');
    icone(btnSom, comSom ? 'volume-2' : 'volume-x');
  };
  const syncPlay = () => {
    btnPlay.setAttribute('aria-label', video.paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
    icone(btnPlay, video.paused ? 'play' : 'pause');
  };
  const tocar = async () => {
    try { video.muted = false; await video.play(); } catch {
      video.muted = true; await video.play().catch(() => {});
    }
    syncSom();
  };

  video.addEventListener('play', syncPlay);
  video.addEventListener('pause', syncPlay);
  video.addEventListener('volumechange', syncSom);
  btnSom.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.paused) { pausadoPeloUsuario = false; video.play().catch(() => {}); }
  });
  btnPlay.addEventListener('click', () => {
    pausadoPeloUsuario = !video.paused;
    if (video.paused) video.play().catch(() => {}); else video.pause();
  });

  // ponytail: pausa fora da tela para o áudio não seguir tocando enquanto a pessoa lê o resto
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !pausadoPeloUsuario) (video.muted ? video.play().catch(() => {}) : tocar());
    else if (!e.isIntersecting) video.pause();
  }, { threshold: 0.4 }).observe(video);

  if (reduz) video.pause(); else tocar();
  syncSom(); syncPlay();
}
