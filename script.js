// ======================================
// FIND MY DUCK 🐥
// ======================================

// GAME VARIABLES
let currentLevel = 1;
let score = 0;
let timeLeft = 30;
let timerInterval;

const totalLevels = 5;

// LEVEL 5 FLEE VARIABLES
let level5Active = false;
let level5EscapeCooldown = false;
let level5EndTime = 0;
const level5Duration = 7000; // 7 seconds chase duration
const escapeDistance = 90;   // Trigger pixel distance

// FUNNY MESSAGES
const wrongMessages = [
    "🌸 No duck here bestie 😭",
    "👀 Are you even looking??",
    "🐥 Quack... you're getting colder.",
    "💀 That was a flower.",
    "🌷 Congratulations! You found... a flower.",
    "🪨 That's literally a rock 😭",
    "☁️ The duck is NOT in the cloud.",
    "🌿 Nice bush. Wrong answer.",
    "😭 Bro, the duck is hiding.",
    "👀 Keep searching!"
];

const level5Messages = [
    "🐥 Nice try!",
    "💨 Too slow!",
    "🐥 Can't catch me!",
    "⚡ Fast duck energy!",
    "🌸 Keep chasing!"
];

// GET HTML ELEMENTS
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const winScreen = document.getElementById("winScreen");
const gameArea = document.getElementById("gameArea");
const duck = document.getElementById("duck");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const nextButton = document.getElementById("nextButton");

// ======================================
// START GAME
// ======================================

function startGame() {
    currentLevel = 1;
    score = 0;
    scoreDisplay.textContent = score;

    startScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    loadLevel();
}

// ======================================
// LOAD LEVEL
// ======================================

function loadLevel() {
    levelDisplay.textContent = currentLevel;
    nextButton.classList.add("hidden");
    duck.style.display = "block";

    // Reset styles that Level 5 might have changed
    duck.style.pointerEvents = "auto";
    duck.style.transition = "";
    duck.style.transform = "";
    duck.style.opacity = "1";
    level5Active = false;

    message.textContent = "👀 Find the duck! 🐥";
    message.style.background = "rgba(255,255,255,0.8)";

    // Level time setup
    timeLeft = 35 - (currentLevel * 4);
    timerDisplay.textContent = timeLeft;

    // Place duck randomly
    moveDuck();

    // Start timer
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    // Level 5 Special Setup
    if (currentLevel === 5) {
        startLevel5();
    }
}

// ======================================
// MOVE DUCK
// ======================================

function moveDuck() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const padding = 30;

    const randomX = Math.random() * (areaWidth - 70 - padding * 2) + padding;
    const randomY = Math.random() * (areaHeight - 70 - padding * 2) + padding;

    duck.style.left = randomX + "px";
    duck.style.top = randomY + "px";

    if (currentLevel >= 3 && currentLevel < 5) {
        duck.style.opacity = "0.75";
    } else {
        duck.style.opacity = "1";
    }
}

// ======================================
// WRONG CLICK
// ======================================

gameArea.addEventListener("click", function(event) {
    if (event.target === duck) {
        return;
    }

    const randomMessage = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
    message.textContent = randomMessage;

    gameArea.style.transform = "translateX(3px)";
    setTimeout(() => { gameArea.style.transform = "translateX(-3px)"; }, 50);
    setTimeout(() => { gameArea.style.transform = "translateX(0)"; }, 100);
});

// ======================================
// FIND DUCK
// ======================================

function findDuck(event) {
    event.stopPropagation();

    // Stop timer
    clearInterval(timerInterval);

    duck.style.display = "none";

    const bonus = timeLeft * 10;
    score += 100 + bonus;
    scoreDisplay.textContent = score;

    message.textContent = "🎉 QUACKKK!! YOU FOUND ME! 🐥";
    message.style.background = "#fff0a8";

    if (currentLevel === totalLevels) {
        setTimeout(showWinScreen, 1200);
    } else {
        nextButton.classList.remove("hidden");
    }
}

// ======================================
// TIMER
// ======================================

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 5) {
        timerDisplay.style.color = "#e85d75";
    }

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        duck.style.display = "none";
        message.textContent = "😭 TIME'S UP! The duck escaped!";
        nextButton.classList.remove("hidden");
    }
}

// ======================================
// NEXT LEVEL
// ======================================

function nextLevel() {
    currentLevel++;
    timerDisplay.style.color = "";
    loadLevel();
}

// ======================================
// WIN SCREEN
// ======================================

function showWinScreen() {
    gameScreen.classList.add("hidden");
    winScreen.classList.remove("hidden");

    document.getElementById("finalScore").textContent = score;

    let finalMessage;
    if (score >= 900) {
        finalMessage = "👑 DUCK FINDING LEGEND!";
    } else if (score >= 600) {
        finalMessage = "🐥 Professional Duck Hunter!";
    } else {
        finalMessage = "🌸 You found the duck! That's what matters 😂";
    }

    document.getElementById("finalMessage").textContent = finalMessage;
}

// ======================================
// RESTART
// ======================================

function restartGame() {
    clearInterval(timerInterval);
    winScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
}

// ======================================
// KEYBOARD SUPPORT
// ======================================

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        if (!gameScreen.classList.contains("hidden")) {
            return;
        }
        startGame();
    }
});

// ======================================
// LEVEL 5 — THE DUCK FIGHTS BACK 🐥💨
// ======================================

function startLevel5() {
    level5Active = true;
    level5EscapeCooldown = false;
    level5EndTime = Date.now() + level5Duration;

    message.textContent = "🐥 LEVEL 5... TRY TO CATCH ME!";
    message.style.background = "#fff0a8";

    // Disable clicks during chase phase
    duck.style.pointerEvents = "none";

    // Ensure initial inline positions exist for detection
    duck.style.left = duck.offsetLeft + "px";
    duck.style.top = duck.offsetTop + "px";

    // Duck tires out after timer
    setTimeout(function() {
        finishLevel5();
    }, level5Duration);
}

// ======================================
// WATCH THE MOUSE / TOUCH
// ======================================

function checkProximity(clientX, clientY) {
    if (currentLevel !== 5 || !level5Active || level5EscapeCooldown) {
        return;
    }

    const rect = gameArea.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const duckX = duck.offsetLeft + duck.offsetWidth / 2;
    const duckY = duck.offsetTop + duck.offsetHeight / 2;

    const distance = Math.hypot(mouseX - duckX, mouseY - duckY);

    if (distance < escapeDistance) {
        escapeDuck();
    }
}

gameArea.addEventListener("mousemove", function(event) {
    checkProximity(event.clientX, event.clientY);
});

gameArea.addEventListener("touchmove", function(event) {
    if (event.touches.length > 0) {
        checkProximity(event.touches[0].clientX, event.touches[0].clientY);
    }
});

// ======================================
// MAKE DUCK ESCAPE
// ======================================

function escapeDuck() {
    if (!level5Active) return;

    if (Date.now() >= level5EndTime) {
        finishLevel5();
        return;
    }

    level5EscapeCooldown = true;

    const randomMessage = level5Messages[Math.floor(Math.random() * level5Messages.length)];
    message.textContent = randomMessage;

    duck.style.pointerEvents = "none";

    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const newX = Math.random() * (areaWidth - duck.offsetWidth - 40) + 20;
    const newY = Math.random() * (areaHeight - duck.offsetHeight - 40) + 20;

    duck.style.transition = "left 0.2s ease-out, top 0.2s ease-out, transform 0.2s ease";
    duck.style.transform = "scale(1.2) rotate(-15deg)";
    duck.style.left = newX + "px";
    duck.style.top = newY + "px";

    setTimeout(function() {
        if (!level5Active) return;
        duck.style.transform = "scale(1) rotate(0deg)";
    }, 200);

    setTimeout(function() {
        level5EscapeCooldown = false;
    }, 250);
}

// ======================================
// DUCK GETS TIRED 😭
// ======================================

function finishLevel5() {
    if (!level5Active) return;

    level5Active = false;

    // Duck can be clicked again
    duck.style.pointerEvents = "auto";
    duck.style.opacity = "1";

    const centerX = (gameArea.clientWidth - duck.offsetWidth) / 2;
    const centerY = (gameArea.clientHeight - duck.offsetHeight) / 2;

    duck.style.transition = "all 0.4s ease";
    duck.style.left = centerX + "px";
    duck.style.top = centerY + "px";
    duck.style.transform = "scale(1.4)";

    message.innerHTML = "🐥 <strong>Okay okay 😭 You win.</strong><br>I'm tired... click me!";
    message.style.background = "#fff0a8";
} 