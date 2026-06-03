// Scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}


// Carrusel
let mediaItems = [];
let currentSlide = 0;
let autoplay = true;
let autoplayInterval = null;

async function loadMedia() {
  try {
    const response = await fetch("media.json");
    mediaItems = await response.json();
  } catch (e) {
    mediaItems = [];
  }

  const container = document.getElementById("slidesContainer");
  const dots = document.getElementById("dots");

  if (!mediaItems.length) {
    container.innerHTML = "<p>No hay fotos/videos cargados.</p>";
    return;
  }

  mediaItems.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "Foto de Laura";
      slide.appendChild(img);
    } else {
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      video.playsInline = true;
      slide.appendChild(video);
    }

    container.appendChild(slide);

    const dot = document.createElement("span");
    dot.className = "dot";
    dot.onclick = () => showSlide(index);
    dots.appendChild(dot);
  });

  showSlide(0);
  startAutoplay();
}

function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  if (!slides.length) return;

  document.querySelectorAll("video").forEach(video => video.pause());

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(() => {
    if (autoplay) nextSlide();
  }, 4500);
}

function toggleAutoplay() {
  autoplay = !autoplay;
  document.getElementById("autoplayBtn").textContent = autoplay ? "⏸ Pausar carrusel" : "▶ Reproducir carrusel";
}

// Juego
let score = 0;
let timeLeft = 35;
let gameRunning = false;
let gameTimer = null;
let fallTimer = null;
let fallSpeed = 4;

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const icecream = document.getElementById("icecream");
const basket = document.getElementById("basket");
const gameArea = document.getElementById("gameArea");
const voucher = document.getElementById("voucher");

function startGame() {
  score = 0;
  timeLeft = 35;
  fallSpeed = 4;
  gameRunning = true;

  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  voucher.classList.add("hidden");
  document.getElementById("startGameBtn").textContent = "Reiniciar juego";

  resetIcecream();

  clearInterval(gameTimer);
  clearInterval(fallTimer);

  gameTimer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame(false);
  }, 1000);

  fallTimer = setInterval(moveIcecream, 18);
}

function resetIcecream() {
  icecream.style.top = "-60px";
  icecream.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 70)) + "px";
}

function moveIcecream() {
  if (!gameRunning) return;

  const top = parseInt(icecream.style.top || "-60", 10) + fallSpeed;
  icecream.style.top = top + "px";

  const i = icecream.getBoundingClientRect();
  const b = basket.getBoundingClientRect();
  const a = gameArea.getBoundingClientRect();

  const hit = i.bottom >= b.top && i.left < b.right && i.right > b.left;

  if (hit) {
    score++;
    scoreEl.textContent = score;
    fallSpeed = Math.min(8, 4 + score * 0.22);
    resetIcecream();
    popConfetti(35);

    if (score >= 12) endGame(true);
  }

  if (i.top > a.bottom) resetIcecream();
}

function endGame(won) {
  gameRunning = false;
  clearInterval(gameTimer);
  clearInterval(fallTimer);

  if (won) {
    voucher.classList.remove("hidden");
    bigCelebration();
  } else {
    alert("Casi Laura 😄 Volvé a intentarlo para ganar el kilo de helado.");
  }
}

function moveBasket(clientX) {
  const a = gameArea.getBoundingClientRect();
  let x = clientX - a.left - basket.clientWidth / 2;
  x = Math.max(0, Math.min(x, gameArea.clientWidth - basket.clientWidth));
  basket.style.left = x + "px";
}

gameArea.addEventListener("mousemove", e => moveBasket(e.clientX));
gameArea.addEventListener("touchmove", e => {
  e.preventDefault();
  moveBasket(e.touches[0].clientX);
}, { passive: false });

// Confeti y fuegos artificiales
const confettiCanvas = document.getElementById("confettiCanvas");
const fireworksCanvas = document.getElementById("fireworksCanvas");
const cctx = confettiCanvas.getContext("2d");
const fctx = fireworksCanvas.getContext("2d");

let confetti = [];
let fireworks = [];

function resizeCanvases() {
  confettiCanvas.width = fireworksCanvas.width = window.innerWidth;
  confettiCanvas.height = fireworksCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvases);
resizeCanvases();

function popConfetti(amount = 120) {
  for (let i = 0; i < amount; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -20,
      size: Math.random() * 7 + 4,
      speed: Math.random() * 5 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.12 + 0.03
    });
  }
}

function confettiLoop() {
  cctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti.forEach(p => {
    p.y += p.speed;
    p.x += Math.sin(p.angle) * 2.2;
    p.angle += p.spin;
    cctx.save();
    cctx.translate(p.x, p.y);
    cctx.rotate(p.angle);
    cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    cctx.restore();
  });

  confetti = confetti.filter(p => p.y < window.innerHeight + 40);
  requestAnimationFrame(confettiLoop);
}

function firework() {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight * 0.45 + 60;

  for (let i = 0; i < 70; i++) {
    const angle = (Math.PI * 2 * i) / 70;
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * (Math.random() * 4 + 2),
      vy: Math.sin(angle) * (Math.random() * 4 + 2),
      life: 75
    });
  }
}

function fireworksLoop() {
  fctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  fireworks.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.035;
    p.life--;

    fctx.globalAlpha = Math.max(p.life / 75, 0);
    fctx.beginPath();
    fctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    fctx.fill();
  });

  fctx.globalAlpha = 1;
  fireworks = fireworks.filter(p => p.life > 0);
  requestAnimationFrame(fireworksLoop);
}

function bigCelebration() {
  popConfetti(280);
  for (let i = 0; i < 7; i++) {
    setTimeout(firework, i * 420);
  }
}

window.addEventListener("load", () => {
  loadMedia();
  popConfetti(240);
  for (let i = 0; i < 5; i++) {
    setTimeout(firework, i * 520);
  }
});

const bgMusic = document.getElementById("bgMusic");

function iniciarMusica() {
  bgMusic.play().catch(() => {});
  document.removeEventListener("click", iniciarMusica);
  document.removeEventListener("touchstart", iniciarMusica);
}

document.addEventListener("click", iniciarMusica);
document.addEventListener("touchstart", iniciarMusica);

confettiLoop();
fireworksLoop();
