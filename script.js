const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const scoreBoard = document.getElementById("score");

const clickSound = document.getElementById("clickSound");
const bgMusic = document.getElementById("bgMusic");
const gameOverSound = document.getElementById("gameOverSound");

let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let scoreX = 0;
let scoreO = 0;

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Start background music on first interaction
document.body.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.volume = 0.3;
        bgMusic.play();
    }
}, { once: true });

cells.forEach(cell => cell.addEventListener("click", playerMove));
restartBtn.addEventListener("click", restartGame);

function playerMove() {
    const index = this.dataset.index;
    if (gameState[index] || !gameActive) return;

    placeMark(index, "X");

    if (checkResult("X")) return;

    setTimeout(aiMove, 500);
}

function aiMove() {
    if (!gameActive) return;

    const emptyCells = gameState
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    placeMark(randomIndex, "O");

    checkResult("O");
}

function placeMark(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;

    clickSound.currentTime = 0;
    clickSound.play();

    if (navigator.vibrate) navigator.vibrate(50);
}

function checkResult(player) {
    for (let pattern of winPatterns) {
        if (pattern.every(i => gameState[i] === player)) {
            gameActive = false;
            statusText.textContent = `Player ${player} Wins!`;

            player === "X" ? scoreX++ : scoreO++;
            updateScore();
            endGame();
            return true;
        }
    }

    if (!gameState.includes("")) {
        gameActive = false;
        statusText.textContent = "It's a Draw!";
        endGame();
        return true;
    }
    return false;
}

function endGame() {
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}

function restartGame() {
    // Reset game state
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;

    // Clear board
    cells.forEach(cell => {
        cell.textContent = "";
    });

    // Reset status
    statusText.textContent = "Player X's Turn";

    // Hide celebration gif
    document.getElementById("celebration").style.display = "none";

    // Stop game-over sound
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
}
