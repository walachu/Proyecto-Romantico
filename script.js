// Variables del juego
let score = 0;
let timeLeft = 60;
let speed = 1;
let gameActive = false;
let gameOver = false;
let heartIdCounter = 0;
let hearts = [];
let gameTimer = null;
let speedTimer = null;
let heartGenerator = null;
let heartMover = null;

// Elementos del DOM
const introScreen = document.getElementById('introScreen');
const gameScreen = document.getElementById('gameScreen');
const messageScreen = document.getElementById('messageScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('scoreDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const speedDisplay = document.getElementById('speedDisplay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreDisplay = document.getElementById('finalScore');
const backgroundHearts = document.getElementById('backgroundHearts');

// Inicializar corazones de fondo
function initBackgroundHearts() {
    for (let i = 0; i < 15; i++) {
        const heart = createSVGHeart();
        heart.classList.add('bg-heart');
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.animationDuration = `${8 + Math.random() * 4}s`;
        heart.style.fontSize = `${20 + Math.random() * 30}px`;
        backgroundHearts.appendChild(heart);
    }
}

// Crear SVG de corazón
function createSVGHeart() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z');
    
    svg.appendChild(path);
    return svg;
}

// Cambiar de pantalla
function showScreen(screen) {
    introScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    messageScreen.classList.remove('active');
    screen.classList.add('active');
}

// Iniciar el juego
function startGame() {
    // Reset variables
    score = 0;
    timeLeft = 60;
    speed = 1;
    gameActive = true;
    gameOver = false;
    hearts = [];
    heartIdCounter = 0;
    
    // Limpiar área de juego
    gameArea.innerHTML = '';
    gameOverOverlay.classList.add('hidden');
    
    // Actualizar displays
    updateDisplays();
    
    // Mostrar pantalla de juego
    showScreen(gameScreen);
    
    // Iniciar timers
    startGameTimer();
    startSpeedTimer();
    startHeartGenerator();
    startHeartMover();
}

// Timer del juego
function startGameTimer() {
    gameTimer = setInterval(() => {
        if (!gameOver) {
            timeLeft--;
            timeDisplay.textContent = `${timeLeft}s`;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

// Timer de velocidad
function startSpeedTimer() {
    speedTimer = setInterval(() => {
        if (!gameOver) {
            speed += 0.3;
            speedDisplay.textContent = `${speed.toFixed(1)}x`;
        }
    }, 5000);
}

// Generador de corazones
function startHeartGenerator() {
    const generateHeart = () => {
        if (!gameOver) {
            const heart = {
                id: heartIdCounter++,
                x: Math.random() * 85 + 5,
                y: -10,
                size: 30 + Math.random() * 20,
                rotation: Math.random() * 360
            };
            
            hearts.push(heart);
            createHeartElement(heart);
        }
    };
    
    // Generar primer corazón
    generateHeart();
    
    // Generar corazones periódicamente (más rápido con la velocidad)
    heartGenerator = setInterval(() => {
        const interval = 800 - (speed * 50);
        clearInterval(heartGenerator);
        heartGenerator = setInterval(generateHeart, Math.max(interval, 300));
        generateHeart();
    }, 800);
}

// Crear elemento visual del corazón
function createHeartElement(heart) {
    const heartEl = createSVGHeart();
    heartEl.classList.add('falling-heart');
    heartEl.id = `heart-${heart.id}`;
    heartEl.style.left = `${heart.x}%`;
    heartEl.style.top = `${heart.y}%`;
    heartEl.style.width = `${heart.size}px`;
    heartEl.style.height = `${heart.size}px`;
    heartEl.style.transform = `rotate(${heart.rotation}deg)`;
    
    heartEl.addEventListener('click', () => catchHeart(heart.id));
    
    gameArea.appendChild(heartEl);
}

// Mover corazones
function startHeartMover() {
    heartMover = setInterval(() => {
        if (!gameOver) {
            hearts = hearts.filter(heart => {
                heart.y += (2 * speed);
                
                const heartEl = document.getElementById(`heart-${heart.id}`);
                if (heartEl) {
                    heartEl.style.top = `${heart.y}%`;
                }
                
                // Eliminar si sale de la pantalla
                if (heart.y > 110) {
                    if (heartEl) {
                        heartEl.remove();
                    }
                    return false;
                }
                
                return true;
            });
        }
    }, 50);
}

// Atrapar corazón
function catchHeart(id) {
    const heartEl = document.getElementById(`heart-${id}`);
    if (heartEl) {
        heartEl.remove();
    }
    
    hearts = hearts.filter(h => h.id !== id);
    score++;
    updateDisplays();
    
    // Verificar si ganó
    if (score >= 50) {
        winGame();
    }
}

// Actualizar displays
function updateDisplays() {
    scoreDisplay.textContent = `${score} / 50`;
    timeDisplay.textContent = `${timeLeft}s`;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
}

// Terminar juego (tiempo agotado)
function endGame() {
    gameOver = true;
    gameActive = false;
    
    clearInterval(gameTimer);
    clearInterval(speedTimer);
    clearInterval(heartGenerator);
    clearInterval(heartMover);
    
    finalScoreDisplay.textContent = score;
    gameOverOverlay.classList.remove('hidden');
}

// Ganar juego
function winGame() {
    gameOver = true;
    gameActive = false;
    
    clearInterval(gameTimer);
    clearInterval(speedTimer);
    clearInterval(heartGenerator);
    clearInterval(heartMover);
    
    setTimeout(() => {
        showScreen(messageScreen);
    }, 1000);
}

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Inicializar cuando cargue la página
window.addEventListener('DOMContentLoaded', () => {
    initBackgroundHearts();
});