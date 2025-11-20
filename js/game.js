// --- GAME CONSTANTS AND INITIAL SETUP ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const messageBox = document.getElementById('message-box');
const messageContent = document.getElementById('message-content');

// Tone.js Synths
const jumpSynth = new Tone.Synth({
    oscillator: { type: 'triangle' }, 
    envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.1 }
}).toDestination();

const crashSynth = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 }
}).toDestination();

// Responsive Canvas
function resizeCanvas() {
    const container = document.getElementById('game-container');
    const newWidth = container.clientWidth;
    canvas.width = newWidth;
    canvas.height = 200; 
    GROUND_Y = canvas.height - 20;
    player.y = GROUND_Y - player.height;
}
window.addEventListener('resize', resizeCanvas);

// Game State
let gameActive = false;
let score = 0;
let highScore = localStorage.getItem('desertHopperHighScore') || 0;
let gameSpeed = 6; 
const GRAVITY = 0.5;
let GROUND_Y; 

let timeSinceLastObstacle = 0;
let obstacleGenerationInterval = 80; 

let obstacles = [];
let clouds = [];
let frameCount = 0;

const player = {
    width: 30, height: 40,
    originalHeight: 40,
    x: 50, y: 0, vy: 0,
    isJumping: false,
    isDucking: false,
    jumpStrength: 11,
    duckHeight: 20
};

const keys = { up: false, down: false, space: false };

// --- SOUND ---
async function playJumpSound() {
    if (Tone.context.state !== 'running') await Tone.start();
    jumpSynth.triggerAttackRelease("D4", "16n");
}
async function playCrashSound() {
    if (Tone.context.state !== 'running') await Tone.start();
    crashSynth.triggerAttackRelease("8n");
}

// --- INIT GAME ---
function initGame() {
    if (Tone.context.state !== 'running') {
        Tone.start().catch(e => console.error("Tone.js failed:", e));
    }
    
    GROUND_Y = canvas.height - 20;
    player.height = player.originalHeight;
    player.y = GROUND_Y - player.height;
    player.vy = 0;

    obstacles = [];
    clouds = [];
    score = 0;
    gameSpeed = 6;
    timeSinceLastObstacle = 0;
    frameCount = 0;

    gameActive = true;
    messageBox.classList.add('hidden');

    requestAnimationFrame(gameLoop);
}

// --- UPDATE LOOP ---
function update() {
    frameCount++;

    if (player.isJumping) {
        player.vy += GRAVITY;
        player.y += player.vy;
    }

    if (player.y >= GROUND_Y - player.height) {
        player.y = GROUND_Y - player.height;
        player.isJumping = false;
        player.vy = 0;
    }

    if (keys.down && !player.isJumping) {
        if (!player.isDucking) {
            player.height = player.duckHeight;
            player.y = GROUND_Y - player.height;
            player.isDucking = true;
        }
    } else {
        if (player.isDucking) {
            player.height = player.originalHeight;
            player.y = GROUND_Y - player.height;
            player.isDucking = false;
        }
    }

    updateClouds();

    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;

        if (obstacle.type === 'bird' && obstacle.dx) obstacle.x += obstacle.dx;
        if (obstacle.type === 'glider') {
            obstacle.x += obstacle.dx;
            obstacle.waveTime += 0.05; 
            obstacle.y = obstacle.initialY + Math.sin(obstacle.waveTime) * obstacle.amplitude;
        }

        if (obstacle.x + obstacle.width < player.x && !obstacle.counted) {
            score++;
            obstacle.counted = true;
        }
    });

    obstacles = obstacles.filter(o => o.x + o.width > 0);

    generateObstacle();

    gameSpeed += 0.0015;
    obstacleGenerationInterval = Math.max(45, obstacleGenerationInterval - 0.05);

    if (checkCollisions()) endGame();
}

// --- CLOUDS ---
function updateClouds() {
    clouds.forEach(cloud => cloud.x -= gameSpeed * 0.15);
    clouds = clouds.filter(c => c.x + 30 > 0);

    if (Math.random() < 0.005) {
        clouds.push({
            x: canvas.width,
            y: 30 + Math.random() * 50
        });
    }
}

// --- CREATE OBSTACLES ---
function createSingleObstacle(type) {
    let width, height, yPos, dx = 0, amplitude = 0, initialY = 0;

    if (type === 'cactus') {
        width = 15 + Math.random() * 15;
        height = 35 + Math.random() * 15;
        yPos = GROUND_Y - height;
    } else if (type === 'rock') {
        width = 10 + Math.random() * 10;
        height = 10 + Math.random() * 10;
        yPos = GROUND_Y - height;
    } else if (type === 'bird') {
        width = 30; height = 15;
        yPos = GROUND_Y - (Math.random() < 0.5 ? 70 : 100);
        dx = 0.5 + Math.random() * 0.3;
    } else if (type === 'tumbleweed') {
        width = 12 + Math.random() * 8;
        height = 12 + Math.random() * 8;
        yPos = GROUND_Y - height;
        dx = -1;
    } else if (type === 'log') {
        width = 40 + Math.random() * 20;
        height = 10;
        yPos = GROUND_Y - height;
    } else if (type === 'glider') {
        width = 40; height = 20;
        initialY = GROUND_Y - 100 - (Math.random() * 30);
        yPos = initialY;
        dx = -1.5;
        amplitude = 20 + Math.random() * 10;
    }

    return {
        x: canvas.width,
        y: yPos,
        width, height,
        type, counted: false,
        dx, initialY, amplitude,
        waveTime: 0
    };
}

// --- GENERATE OBSTACLES ---
function generateObstacle() {
    timeSinceLastObstacle++;

    if (timeSinceLastObstacle > obstacleGenerationInterval) {
        if (Math.random() < 0.25) {
            const groupType = Math.random() < 0.6 ? 'cactus' : 'rock';
            const groupSize = 2 + Math.floor(Math.random() * 2);
            let currentX = canvas.width;

            for (let i = 0; i < groupSize; i++) {
                const obstacle = createSingleObstacle(groupType);
                obstacle.x = currentX;
                obstacles.push(obstacle);
                currentX += obstacle.width + 10 + Math.random() * 15;
            }
        } else {
            const r = Math.random();
            let type;

            if (r < 0.20) type = 'cactus';
            else if (r < 0.35) type = 'bird';
            else if (r < 0.50) type = 'rock';
            else if (r < 0.65) type = 'tumbleweed';
            else if (r < 0.80) type = 'log';
            else type = 'glider';

            obstacles.push(createSingleObstacle(type));
        }

        timeSinceLastObstacle = 0;
        obstacleGenerationInterval = 70 + Math.random() * 80;
    }
}

// --- COLLISION ---
function checkCollisions() {
    for (const obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            return true;
        }
    }
    return false;
}

// --- DRAW FUNCTIONS ---
function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 10, 0, Math.PI * 2);
        ctx.arc(cloud.x + 15, cloud.y - 5, 15, 0, Math.PI * 2);
        ctx.arc(cloud.x + 30, cloud.y, 10, 0, Math.PI * 2);
        ctx.arc(cloud.x + 5, cloud.y + 5, 12, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPlayer() {
    const color = gameActive ? '#3d3d3d' : '#8c8c8c';
    ctx.fillStyle = color;

    const px = player.x, py = player.y;
    const pw = player.width, ph = player.height;
    const leg = Math.floor(frameCount / 6) % 2;

    ctx.beginPath();

    if (player.isDucking)
        ctx.rect(px, py, pw, ph);
    else {
        ctx.moveTo(px, py + ph);
        ctx.lineTo(px, py + ph * 0.2);
        ctx.arcTo(px, py, px + pw * 0.8, py, 10);
        ctx.lineTo(px + pw * 0.8, py);
        ctx.lineTo(px + pw, py + ph * 0.2);
        ctx.lineTo(px + pw * 0.8, py + ph * 0.6);
        ctx.lineTo(px - 10, py + ph * 0.8);

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

    ctx.fillStyle = '#fff';
    ctx.fillRect(px + pw - 7, py + 5, 4, 4);
}

function drawCactus(x, y, w, h) {
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x + w * 0.3, y, w * 0.4, h);
    ctx.fillRect(x, y + h * 0.5, w * 0.3, w * 0.2);
    ctx.fillRect(x, y + h * 0.2, w * 0.1, h * 0.3);
    ctx.fillRect(x + w * 0.7, y + h * 0.2, w * 0.3, w * 0.1);
    ctx.fillRect(x + w * 0.9, y, w * 0.1, h * 0.2);
}

function drawBird(x, y, w, h) {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    const wingY = y + h / 2;
    const wingH = h * 0.5;
    const up = (Math.floor(frameCount / 4) % 2 === 0);

    ctx.fillStyle = '#D97706';

    ctx.beginPath();
    ctx.moveTo(x + w * 0.1, wingY);
    ctx.lineTo(x + w * 0.5, wingY + (up ? -wingH : wingH));
    ctx.lineTo(x + w * 0.5, wingY);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w * 0.9, wingY);
    ctx.lineTo(x + w * 0.5, wingY + (up ? -wingH : wingH));
    ctx.lineTo(x + w * 0.5, wingY);
    ctx.fill();
}

function drawRock(x, y, w, h) {
    ctx.fillStyle = '#78716C';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w * 0.2, y + h * 0.2);
    ctx.arcTo(x + w * 0.5, y - h * 0.1, x + w * 0.8, y + h * 0.2, 5);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
}

function drawTumbleweed(x, y, w, h) {
    ctx.fillStyle = '#C2410C';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
    ctx.moveTo(x + w * 0.1, y + h * 0.1);
    ctx.lineTo(x + w * 0.5, y - 5);
    ctx.lineTo(x + w * 0.9, y + h * 0.1);
    ctx.moveTo(x + w * 0.1, y + h * 0.9);
    ctx.lineTo(x + w * 0.5, y + h + 5);
    ctx.lineTo(x + w * 0.9, y + h * 0.9);
    ctx.fill();
}

function drawLog(x, y, w, h) {
    ctx.fillStyle = '#6D4C41';
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1;

    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    for (let i = 1; i < 5; i++) {
        ctx.moveTo(x + i * (w/5) + (frameCount * 0.5) % 5, y);
        ctx.lineTo(x + i * (w/5) + (frameCount * 0.5) % 5, y + h);
    }
    ctx.stroke();
}

function drawGlider(x, y, w, h) {
    ctx.fillStyle = '#60A5FA';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y + h/2);
    ctx.lineTo(x + w, y + h/2);
    ctx.lineTo(x + w * 0.7, y + h);
    ctx.lineTo(x + w * 0.3, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1E40AF';
    ctx.fillRect(x + w * 0.4, y + h * 0.2, w * 0.2, h * 0.3);
}

// --- DRAW LOOP ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e0f2f7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawClouds();

    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, GROUND_Y + 2, canvas.width, canvas.height - GROUND_Y);

    ctx.strokeStyle = '#b4b4b4';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const offset = (frameCount * gameSpeed * 0.5) % 30;
    ctx.setLineDash([10, 5]);
    ctx.lineDashOffset = -offset;

    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    ctx.setLineDash([]);

    obstacles.forEach(o => {
        if (o.type === 'cactus') drawCactus(o.x, o.y, o.width, o.height);
        else if (o.type === 'bird') drawBird(o.x, o.y, o.width, o.height);
        else if (o.type === 'rock') drawRock(o.x, o.y, o.width, o.height);
        else if (o.type === 'tumbleweed') drawTumbleweed(o.x, o.y, o.width, o.height);
        else if (o.type === 'log') drawLog(o.x, o.y, o.width, o.height);
        else if (o.type === 'glider') drawGlider(o.x, o.y, o.width, o.height);
    });

    drawPlayer();

    ctx.font = 'bold 18px Inter';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'right';

    const displayHigh = Math.floor(highScore).toString().padStart(5, '0');
    ctx.fillText(`HI ${displayHigh}`, canvas.width - 180, 30);

    const displayScore = Math.floor(score).toString().padStart(5, '0');
    ctx.fillText(displayScore, canvas.width - 20, 30);

    ctx.textAlign = 'left';
    const speed = Math.floor(gameSpeed * 10).toString().padStart(3, '0');
    ctx.fillText(`SPEED ${speed}`, 20, 30);
}

// --- MESSAGE BOX ---
function showMessageBox(type, finalScore = 0) {
    highScore = localStorage.getItem('desertHopperHighScore') || 0;

    document.getElementById('message-title').textContent =
        type === 'gameOver' ? "GAME OVER" : "DESERT HOPPER";

    let contentHTML = `
        <p class="text-xl mb-3 font-semibold">Instructions:</p>
        <ul class="list-disc list-inside text-left mx-auto max-w-xs space-y-1 text-base">
            <li><span class="font-bold">Jump:</span> SPACEBAR or ↑</li>
            <li><span class="font-bold">Duck:</span> ↓ (Down Arrow)</li>
        </ul>
        <p class="mt-4 text-sm text-gray-600">Avoid all obstacles. Speed increases over time!</p>
    `;

    if (type === 'gameOver') {
        contentHTML += `
            <div class="score-display">
                <p class="text-xl mb-1">Your Score: <span class="font-bold text-orange-600">${Math.floor(finalScore)}</span></p>
                <p class="text-lg">High Score: <span class="font-bold">${highScore}</span></p>
            </div>
        `;
        document.getElementById('message-prompt').textContent = "(Press SPACE to Retry)";
    } else {
        contentHTML += `
            <div class="score-display">
                <p class="text-lg font-bold">Current High Score: ${highScore}</p>
            </div>
        `;
        document.getElementById('message-prompt').textContent = "(Press SPACE to Start)";
    }

    messageContent.innerHTML = contentHTML;
    messageBox.classList.remove('hidden');
}

// --- END GAME ---
function endGame() {
    gameActive = false;
    playCrashSound();

    if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem('desertHopperHighScore', highScore);
    }

    draw();
    showMessageBox('gameOver', score);
}

// --- MAIN LOOP ---
function gameLoop() {
    if (!gameActive) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- INPUT ---
function attemptJump() {
    if (!player.isJumping && !keys.down) {
        player.isJumping = true;
        player.vy = -player.jumpStrength;
        playJumpSound();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!gameActive) initGame();
        else {
            keys.up = true;
            keys.space = true;
            attemptJump();
        }
    } else if (e.key === 'ArrowDown') {
        keys.down = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        keys.up = false;
        keys.space = false;
    } else if (e.key === 'ArrowDown') {
        keys.down = false;
    }
});

// --- STARTUP ---
window.onload = function() {
    resizeCanvas();
    GROUND_Y = canvas.height - 20;
    player.y = GROUND_Y - player.height;
    draw();
    showMessageBox('start');
};
