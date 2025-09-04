const welcomeMsg = document.querySelector(".welcome-msg");
const buttons = document.querySelectorAll(".btn");
const colors = ["green", "red", "blue", "yellow"];
const startBtn = document.getElementById("start-btn");
const levelDisplay = document.getElementById("level-display");
const scoreDisplay = document.getElementById("score-display");
const highestLevelDisplay = document.getElementById("highest-level-display");
const highestScoreDisplay = document.getElementById("highest-score-display");
const gameOverMsg = document.getElementById("game-over-msg");

let gameSequence = [];
let playerSequence = [];
let level = 0;
let score = 0;
let highestLevel = localStorage.getItem("highestLevel") || 0;
let highestScore = localStorage.getItem("highestScore") || 0;
let acceptingInput = false;
let flashDuration = 600;
let flashDelay = 200;

updateDisplays();
gameOverMsg.style.display = "none";
startBtn.addEventListener("click", startGame);

function startGame() {
  gameSequence = [];
  playerSequence = [];
  level = 0;
  score = 0;
  acceptingInput = false;
  flashDuration = 600;
  flashDelay = 200;
  updateDisplays();
  gameOverMsg.style.display = "none";
  welcomeMsg.textContent = "Game Started!";
  addColorToSequence();
}

function addColorToSequence() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gameSequence.push(randomColor);
  flashSequence();
}

function flashSequence() {
  buttons.forEach((btn) => (btn.disabled = true));
  acceptingInput = false;

  let i = 0;

  function flashNext() {
    if (i >= gameSequence.length) {
      buttons.forEach((btn) => (btn.disabled = false));
      acceptingInput = true;
      return;
    }

    const color = gameSequence[i];
    const button = document.querySelector(`.${color}`);

    button.classList.add("active");
    setTimeout(() => {
      button.classList.remove("active");
      i++;
      setTimeout(flashNext, flashDelay);
    }, flashDuration);
  }

  flashNext();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!acceptingInput) return;

    const color = button.classList[0];
    playerSequence.push(color);

    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 200);

    checkMove(playerSequence.length - 1);
  });
});

function checkMove(index) {
  if (playerSequence[index] !== gameSequence[index]) {
    welcomeMsg.textContent = "Game Over!";
    gameOverMsg.textContent = "Game Over! Press Start to play again";
    gameOverMsg.style.display = "block";

    if (level > highestLevel) {
      highestLevel = level;
      localStorage.setItem("highestLevel", highestLevel);
    }
    if (score > highestScore) {
      highestScore = score;
      localStorage.setItem("highestScore", highestScore);
    }

    level = 0;
    score = 0;
    gameSequence = [];
    playerSequence = [];
    acceptingInput = false;
    updateDisplays();
    return;
  }

  if (playerSequence.length === gameSequence.length) {
    level++;
    score += 5;
    flashDuration = Math.max(200, flashDuration - 30);
    flashDelay = Math.max(100, flashDuration - 20);
    updateDisplays();
    playerSequence = [];
    setTimeout(addColorToSequence, 800);
  }
}

function updateDisplays() {
  levelDisplay.textContent = `Level: ${level}`;
  scoreDisplay.textContent = `Score: ${score}`;
  highestLevelDisplay.textContent = `Highest Level: ${highestLevel}`;
  highestScoreDisplay.textContent = `Highest Score: ${highestScore}`;
}
