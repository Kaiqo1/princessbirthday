const candleWrap = document.getElementById('candles');
const candleButton = document.getElementById('candleBtn');
const wishMessage = document.getElementById('wishMessage');
const birthdaySong = document.getElementById('birthdaySong');
const musicStatus = document.getElementById('musicStatus');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const confettiCanvas = document.getElementById('confetti');
const confettiContext = confettiCanvas.getContext('2d');
let particles = [];
let animationFrame = 0;

for (let index = 0; index < 19; index += 1) {
  const candle = document.createElement('span');
  candle.className = 'candle';
  candle.innerHTML = '<span class="flame"></span>';
  candleWrap.appendChild(candle);
}

if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealItems = document.querySelectorAll('.love-note, .celebration-inner, .letter, .memories-heading, .memory-row, .wish-inner, .footer');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.documentElement.classList.add('motion-ready');
  revealItems.forEach(item => {
    item.classList.add('scroll-reveal');
    revealObserver.observe(item);
  });
}

birthdaySong.addEventListener('error', () => {
  musicStatus.textContent = 'Add wave-to-earth-love.mp3 beside index.html to play the song.';
});
birthdaySong.addEventListener('loadedmetadata', () => {
  musicStatus.textContent = birthdaySong.paused ? 'Loaded · tap Play to listen' : 'Playing · plays on repeat';
});
birthdaySong.addEventListener('playing', () => {
  musicStatus.textContent = 'Playing · plays on repeat';
});

birthdaySong.play().catch(() => {
  musicStatus.textContent = 'Tap Play to start the birthday song';
});

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  confettiCanvas.width = window.innerWidth * pixelRatio;
  confettiCanvas.height = window.innerHeight * pixelRatio;
  confettiContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function celebrate(count = 90) {
  if (reducedMotion) return;

  const colors = ['#ed6fa8', '#79bfff', '#ffffff', '#253552'];
  particles = Array.from({ length: count }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.38,
    vx: (Math.random() - 0.5) * 9,
    vy: Math.random() * -8 - 2,
    size: Math.random() * 6 + 3,
    life: 90 + Math.random() * 40,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  if (!animationFrame) animationFrame = requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(particle => particle.life > 0);

  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.16;
    particle.life -= 1;
    confettiContext.globalAlpha = Math.min(particle.life / 35, 1);
    confettiContext.fillStyle = particle.color;
    confettiContext.fillRect(particle.x, particle.y, particle.size, particle.size * 0.65);
  });

  confettiContext.globalAlpha = 1;
  if (particles.length) {
    animationFrame = requestAnimationFrame(drawConfetti);
  } else {
    confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    animationFrame = 0;
  }
}

const loveAnswer = document.getElementById('loveAnswer');
const noButton = document.getElementById('noBtn');
const choicesArea = noButton.parentElement;
const yesButton = document.getElementById('loveBtn');

yesButton.addEventListener('click', () => {
  loveAnswer.textContent = 'Yessu i luvv ma princesssssss pookieeee chessy wife dheraiiiiiiiiiiiii a lootuuuuuuuuuuuuuu loottuuuuuuuuu bleehhhhhhhhhhhhh';
  celebrate(110);
});

function dodgeNo(event) {
  if (event.cancelable) event.preventDefault();
  const minLeft = yesButton.offsetLeft + yesButton.offsetWidth + 16;
  const maxLeft = choicesArea.clientWidth - noButton.offsetWidth;
  const maxTop = choicesArea.clientHeight - noButton.offsetHeight;
  const travelWidth = Math.max(0, maxLeft - minLeft);
  noButton.style.left = `${minLeft + Math.random() * travelWidth}px`;
  noButton.style.top = `${Math.random() * Math.max(0, maxTop)}px`;
  loveAnswer.textContent = '';
}

noButton.addEventListener('pointerenter', dodgeNo);
noButton.addEventListener('pointerdown', dodgeNo);
noButton.addEventListener('click', dodgeNo);
noButton.addEventListener('focus', dodgeNo);

candleButton.addEventListener('click', () => {
  const flames = document.querySelectorAll('.flame');
  const candlesAreLit = document.querySelector('.flame:not(.out)') !== null;

  flames.forEach(flame => flame.classList.toggle('out', candlesAreLit));
  candleButton.setAttribute('aria-pressed', String(candlesAreLit));
  candleButton.textContent = candlesAreLit ? 'Light the candles again' : 'Blow out the candles';
  wishMessage.textContent = candlesAreLit ? 'Make a wish, Princessss pieeeeee!' : '';
  if (candlesAreLit) celebrate(120);
});

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
