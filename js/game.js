// =========================
//  DESERT HOPPER GAME ENGINE
// =========================

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const API_GAMES = "http://localhost:5000/api/games";

// UI elements
const crashMenuEl = document.getElementById("crash-menu");
const crashScoreEl = document.getElementById("crash-score");

const coinCountSidebar = document.getElementById("sidebar-coins");
const obstaclesSidebar = document.getElementById("sidebar-obstacles");

// State
let gameActive = false;
let score = 0;
let sessionObstacles = 0;

let gameSpeed = 6;
let frameCount = 0;
let GROUND_Y;

let obstacles = [];
let clouds = [];
let timeSinceLastObstacle = 0;
let obstacleGenerationInterval = 80;

// Player physics
const GRAVITY = 0.5;

const player = {
  width: 30,
  height: 40,
  originalHeight: 40,
  x: 50,
  y: 0,
  vy: 0,
  isJumping: false,
  isDucking: false,
  jumpStrength: 11,
  duckHeight: 20
};

const keys = { down: false };

// =========================
//  Canvas Resize
// =========================
function resizeCanvas() {
  const container = document.querySelector(".game-card") || document.body;
  const w = container ? Math.min(900, container.clientWidth - 40) : 900;
  canvas.width = w;
  canvas.height = 200;

  GROUND_Y = canvas.height - 20;
  player.y = GROUND_Y - player.height;
}
window.addEventListener("resize", resizeCanvas);

// =========================
//  Sound (Tone.js)
// =========================
const jumpSynth = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.1 }
}).toDestination();

const crashSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 }
}).toDestination();

async function playJumpSound() {
  if (Tone.context.state !== "running") await Tone.start();
  jumpSynth.triggerAttackRelease("D4", "16n");
}

async function playCrashSound() {
  if (Tone.context.state !== "running") await Tone.start();
  crashSynth.triggerAttackRelease("8n");
}

// =========================
//  Start Game
// =========================
function initGame() {
  if (Tone.context.state !== "running") {
    Tone.start().catch(() => {});
  }

  GROUND_Y = canvas.height - 20;
  player.height = player.originalHeight;
  player.y = GROUND_Y - player.height;
  player.vy = 0;

  obstacles = [];
  clouds = [];

  gameSpeed = 6;
  frameCount = 0;
  timeSinceLastObstacle = 0;
  sessionObstacles = 0;

  gameActive = true;
  requestAnimationFrame(gameLoop);
}

// =========================
//  Game Loop
// =========================
function gameLoop() {
  if (!gameActive) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// =========================
//  Update
// =========================
function update() {
  frameCount++;

  // Player physics
  if (player.isJumping) {
    player.vy += GRAVITY;
    player.y += player.vy;
  }

  if (player.y >= GROUND_Y - player.height) {
    player.y = GROUND_Y - player.height;
    player.vy = 0;
    player.isJumping = false;
  }

  // Ducking
  if (keys.down && !player.isJumping) {
    if (!player.isDucking) {
      player.height = player.duckHeight;
      player.y = GROUND_Y - player.height;
      player.isDucking = true;
    }
  } else if (player.isDucking) {
    player.height = player.originalHeight;
    player.y = GROUND_Y - player.height;
    player.isDucking = false;
  }

  updateClouds();

  // Obstacles
  obstacles.forEach(o => {
    o.x -= gameSpeed;

    if (o.type === "bird" && o.dx) o.x += o.dx;
    if (o.type === "glider") {
      o.x += o.dx;
      o.waveTime += 0.05;
      o.y = o.initialY + Math.sin(o.waveTime) * o.amplitude;
    }

    if (o.x + o.width < player.x && !o.counted) {
      score++;
      sessionObstacles++;
      o.counted = true;
      updateHud();
    }
  });

  obstacles = obstacles.filter(o => o.x + o.width > 0);

  generateObstacle();

  gameSpeed += 0.0015;
  obstacleGenerationInterval = Math.max(45, obstacleGenerationInterval - 0.05);

  if (checkCollisions()) endGame();
}

// =========================
//  Draw
// =========================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.fillStyle = "#e0f2f7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawClouds();

  // Ground
  ctx.fillStyle = "#fef3c7";
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

  ctx.strokeStyle = "#b4b4b4";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(canvas.width, GROUND_Y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Obstacles
  obstacles.forEach(o => {
    if (o.type === "cactus") drawCactus(o.x, o.y, o.width, o.height);
    else if (o.type === "bird") drawBird(o.x, o.y, o.width, o.height);
    else if (o.type === "rock") drawRock(o.x, o.y, o.width, o.height);
    else if (o.type === "tumbleweed") drawTumbleweed(o.x, o.y, o.width, o.height);
    else if (o.type === "log") drawLog(o.x, o.y, o.width, o.height);
    else if (o.type === "glider") drawGlider(o.x, o.y, o.width, o.height);
  });

  drawPlayer();

  // HUD
  ctx.font = "bold 18px Inter";
  ctx.fillStyle = "#555";
  ctx.textAlign = "right";
  ctx.fillText(`Obstacles ${String(sessionObstacles).padStart(3, "0")}`, canvas.width - 180, 30);
  ctx.fillText(`Coins ${String(score).padStart(3, "0")}`, canvas.width - 20, 30);
  ctx.textAlign = "left";
  ctx.fillText(`SPEED ${String(Math.floor(gameSpeed * 10)).padStart(3, "0")}`, 20, 30);
}

// =========================
//  Collision
// =========================
function checkCollisions() {
  for (const o of obstacles) {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      return true;
    }
  }
  return false;
}

// =========================
//  End Game
// =========================
function endGame() {
  gameActive = false;
  playCrashSound();
  draw();
  if (crashScoreEl) crashScoreEl.textContent = score;
  if (crashMenuEl) crashMenuEl.classList.remove("hidden");
}

// =========================
//  Input
// =========================
function attemptJump() {
  if (!player.isJumping && !keys.down) {
    player.isJumping = true;
    player.vy = -player.jumpStrength;
    playJumpSound();
  }
}

document.addEventListener("keydown", e => {
  if (e.key === " " || e.key === "ArrowUp") {
    e.preventDefault();
    const startPanel = document.getElementById("start-panel");
    if (startPanel && !startPanel.classList.contains("hidden")) return;
    if (!gameActive) initGame();
    else attemptJump();
  }

  if (e.key === "ArrowDown") keys.down = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowDown") keys.down = false;
});

// =========================
//  Obstacle Generation
// =========================
function createSingleObstacle(type) {
  let width, height, yPos, dx = 0, amplitude = 0, initialY = 0;

  if (type === "cactus") {
    width = 15 + Math.random() * 15;
    height = 35 + Math.random() * 15;
    yPos = GROUND_Y - height;
  } else if (type === "rock") {
    width = 10 + Math.random() * 10;
    height = 10 + Math.random() * 10;
    yPos = GROUND_Y - height;
  } else if (type === "bird") {
    width = 30;
    height = 15;
    yPos = GROUND_Y - (Math.random() < 0.5 ? 70 : 100);
    dx = 0.5 + Math.random() * 0.3;
  } else if (type === "tumbleweed") {
    width = 12 + Math.random() * 8;
    height = 12 + Math.random() * 8;
    yPos = GROUND_Y - height;
    dx = -1;
  } else if (type === "log") {
    width = 40 + Math.random() * 20;
    height = 10;
    yPos = GROUND_Y - height;
  } else if (type === "glider") {
    width = 40;
    height = 20;
    initialY = GROUND_Y - 100 - Math.random() * 30;
    yPos = initialY;
    dx = -1.5;
    amplitude = 20 + Math.random() * 10;
  }

  return {
    x: canvas.width,
    y: yPos,
    width,
    height,
    type,
    counted: false,
    dx,
    initialY,
    amplitude,
    waveTime: 0
  };
}

function generateObstacle() {
  timeSinceLastObstacle++;
  if (timeSinceLastObstacle > obstacleGenerationInterval) {
    const r = Math.random();
    let type;
    if (r < 0.20) type = "cactus";
    else if (r < 0.35) type = "bird";
    else if (r < 0.50) type = "rock";
    else if (r < 0.65) type = "tumbleweed";
    else if (r < 0.80) type = "log";
    else type = "glider";

    obstacles.push(createSingleObstacle(type));
    timeSinceLastObstacle = 0;
    obstacleGenerationInterval = 70 + Math.random() * 80;
  }
}

// =========================
//  Clouds
// =========================
function updateClouds() {
  clouds.forEach(c => c.x -= gameSpeed * 0.15);
  clouds = clouds.filter(c => c.x + 30 > 0);

  if (Math.random() < 0.005) {
    clouds.push({
      x: canvas.width,
      y: 30 + Math.random() * 50
    });
  }
}

function drawClouds() {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  clouds.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
    ctx.arc(c.x + 15, c.y - 5, 15, 0, Math.PI * 2);
    ctx.arc(c.x + 30, c.y, 10, 0, Math.PI * 2);
    ctx.arc(c.x + 5, c.y + 5, 12, 0, Math.PI * 2);
    ctx.fill();
  });
}

// =========================
//  Player Drawing (same Dino)
// =========================
function drawPlayer() {
  const px = player.x;
  const py = player.y;
  const pw = player.width;
  const ph = player.height;

  ctx.fillStyle = gameActive ? "#3d3d3d" : "#8c8c8c";
  ctx.beginPath();

  if (player.isDucking) {
    ctx.rect(px, py, pw, ph);
  } else {
    ctx.moveTo(px, py + ph);
    ctx.lineTo(px, py + ph * 0.2);
    ctx.arcTo(px, py, px + pw * 0.8, py, 10);
    ctx.lineTo(px + pw * 0.8, py);
    ctx.lineTo(px + pw, py + ph * 0.2);
    ctx.lineTo(px + pw * 0.8, py + ph * 0.6);
    ctx.lineTo(px - 10, py + ph * 0.8);

    const leg = Math.floor(frameCount / 6) % 2;

    if (!player.isJumping) {
      if (leg === 0) {
        ctx.lineTo(px + pw * 0.2, py + ph);
        ctx.lineTo(px + pw * 0.7, py + ph);
      } else {
        ctx.lineTo(px + pw * 0.7, py + ph);
        ctx.lineTo(px + pw * 0.2, py + ph);
      }
    } else {
      ctx.lineTo(px + pw, py + ph);
    }

    ctx.lineTo(px, py + ph);
  }

  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.fillRect(px + pw - 7, py + 5, 4, 4);
}

// =========================
//  Obstacle Drawing
// =========================
function drawCactus(x, y, w, h) {
  ctx.fillStyle = "#10B981";
  ctx.fillRect(x + w * 0.3, y, w * 0.4, h);
  ctx.fillRect(x, y + h * 0.5, w * 0.3, w * 0.2);
  ctx.fillRect(x, y + h * 0.2, w * 0.1, h * 0.3);
  ctx.fillRect(x + w * 0.7, y + h * 0.2, w * 0.3, w * 0.1);
  ctx.fillRect(x + w * 0.9, y, w * 0.1, h * 0.2);
}

function drawBird(x, y, w, h) {
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  const up = Math.floor(frameCount / 4) % 2 === 0;
  const wingH = h * 0.5;

  ctx.fillStyle = "#D97706";

  ctx.beginPath();
  ctx.moveTo(x + w * 0.1, y + h / 2);
  ctx.lineTo(x + w * 0.5, y + h / 2 + (up ? -wingH : wingH));
  ctx.lineTo(x + w * 0.5, y + h / 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + w * 0.9, y + h / 2);
  ctx.lineTo(x + w * 0.5, y + h / 2 + (up ? -wingH : wingH));
  ctx.lineTo(x + w * 0.5, y + h / 2);
  ctx.fill();
}

function drawRock(x, y, w, h) {
  ctx.fillStyle = "#78716C";
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w * 0.2, y + h * 0.2);
  ctx.arcTo(x + w * 0.5, y - h * 0.1, x + w * 0.8, y + h * 0.2, 5);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
}

function drawTumbleweed(x, y, w, h) {
  ctx.fillStyle = "#C2410C";
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawLog(x, y, w, h) {
  ctx.fillStyle = "#6D4C41";
  ctx.strokeStyle = "#5D4037";
  ctx.lineWidth = 1;

  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  for (let i = 1; i < 5; i++) {
    ctx.moveTo(x + i * (w / 5) + (frameCount * 0.5) % 5, y);
    ctx.lineTo(x + i * (w / 5) + (frameCount * 0.5) % 5, y + h);
  }
  ctx.stroke();
}

function drawGlider(x, y, w, h) {
  ctx.fillStyle = "#60A5FA";
  ctx.strokeStyle = "#3B82F6";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w * 0.7, y + h);
  ctx.lineTo(x + w * 0.3, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1E40AF";
  ctx.fillRect(x + w * 0.4, y + h * 0.2, w * 0.2, h * 0.3);
}

// =========================
//  HUD
// =========================
function updateHud() {
  if (coinCountSidebar) coinCountSidebar.textContent = score;
  if (obstaclesSidebar) obstaclesSidebar.textContent = sessionObstacles;
}

// =========================
//  Saving & Auto-load
// =========================
async function loadExistingSave() {
  try {
    const res = await authFetch(`${API_GAMES}/latest`);
    if (!res.ok) {
      score = 0;
      updateHud();
      return;
    }
    const data = await res.json();
    score = data.coins || 0;
    updateHud();
  } catch {
    score = 0;
    updateHud();
  }
}

async function saveToBackend() {
  try {
    await authFetch(`${API_GAMES}/save`, {
      method: "POST",
      body: JSON.stringify({
        coins: score,
        obstaclesPassed: sessionObstacles
      })
    });
  } catch {
    // ignore for now
  }
}

// =========================
//  Window Load
// =========================
window.onload = async function () {
  resizeCanvas();
  draw();

  // Auto-load existing save
  await loadExistingSave();

  // Play Again flow
  if (localStorage.getItem("playAgain") === "1") {
    localStorage.removeItem("playAgain");
    const startPanel = document.getElementById("start-panel");
    if (startPanel) startPanel.classList.add("hidden");
    initGame();
  }
};

// Before redirecting to save page (from ui.goToSavePage)
// we store current progress into localStorage, which save.html uses
window.addEventListener("beforeunload", () => {
  localStorage.setItem("pendingScore", String(score));
  localStorage.setItem("pendingObstacles", String(sessionObstacles));
});
