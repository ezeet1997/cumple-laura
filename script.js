let score = 0;
let timeLeft = 30;
let gameRunning = false;
let timer = null;
let fallInterval = null;

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const gift = document.getElementById("gift");
const basket = document.getElementById("basket");
const gameArea = document.getElementById("gameArea");
const voucher = document.getElementById("voucher");

function scrollToGame() {
  document.getElementById("game").scrollIntoView({ behavior: "smooth" });
}

function startGame() {
  score = 0;
  timeLeft = 30;
  gameRunning = true;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  voucher.classList.add("hidden");
  document.getElementById("startBtn").textContent = "Reiniciar juego";

  resetGift();

  clearInterval(timer);
  clearInterval(fallInterval);

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);

  fallInterval = setInterval(moveGift, 20);
}

function resetGift() {
  const areaWidth = gameArea.clientWidth;
  gift.style.top = "-60px";
  gift.style.left = Math.floor(Math.random() * (areaWidth - 60)) + "px";
}

function moveGift() {
  if (!gameRunning) return;

  const currentTop = parseInt(gift.style.top || "-60", 10);
  gift.style.top = currentTop + 4 + "px";

  const giftBox = gift.getBoundingClientRect();
  const basketBox = basket.getBoundingClientRect();
  const areaBox = gameArea.getBoundingClientRect();

  const collision =
    giftBox.bottom >= basketBox.top &&
    giftBox.left < basketBox.right &&
    giftBox.right > basketBox.left;

  if (collision) {
    score++;
    scoreEl.textContent = score;
    resetGift();

    if (score >= 10) {
      endGame(true);
    }
  }

  if (giftBox.top > areaBox.bottom) {
    resetGift();
  }
}

function endGame(won) {
  gameRunning = false;
  clearInterval(timer);
  clearInterval(fallInterval);

  if (won) {
    voucher.classList.remove("hidden");
    launchConfetti();
  } else {
    alert("Casi! Intentá de nuevo para desbloquear el voucher 🎁");
  }
}

function moveBasket(clientX) {
  const areaBox = gameArea.getBoundingClientRect();
  let x = clientX - areaBox.left - basket.clientWidth / 2;
  x = Math.max(0, Math.min(x, gameArea.clientWidth - basket.clientWidth));
  basket.style.left = x + "px";
}

gameArea.addEventListener("mousemove", (e) => moveBasket(e.clientX));
gameArea.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moveBasket(e.touches[0].clientX);
}, { passive: false });

// Confetti simple
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: Math.random() * 8 + 4,
    speed: Math.random() * 4 + 2,
    angle: Math.random() * Math.PI * 2
  }));

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pieces.forEach(p => {
    p.y += p.speed;
    p.x += Math.sin(p.angle) * 2;
    p.angle += 0.04;

    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  pieces = pieces.filter(p => p.y < canvas.height + 20);

  if (pieces.length) {
    requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
