const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const overlay = document.getElementById("overlay");
const winnerText = document.getElementById("winner-text");
const winnerSymbol = document.getElementById("winner-symbol");
const drawSymbols = document.getElementById("draw-symbols");

const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");

const playerXLabel = document.getElementById("player-x");
const playerOLabel = document.getElementById("player-o");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;

let scores = { X: 0, O: 0 };

function createBoard() {
    // Get the overlay element before clearing
    const overlay = document.getElementById("overlay");
    
    // Clear only the cells, not the overlay
    const cells = boardEl.querySelectorAll(".cell");
    cells.forEach(cell => cell.remove());
    
    // Create new cells
    board.forEach((_, i) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = () => makeMove(i);
        boardEl.insertBefore(cell, overlay);
    });
}

function makeMove(i) {
    if (board[i] || gameOver) return;

    board[i] = currentPlayer;
    boardEl.children[i].textContent = currentPlayer;

    const win = checkWinner();
    if (win) {
        highlightWinner(win);
        scores[currentPlayer]++;
        updateScore();
        endGame("winner", currentPlayer);
        return;
    }

    if (board.every(c => c !== null)) {
        endGame("draw");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.textContent = `Player ${currentPlayer}'s Turn`;
    updateActivePlayer();
}

function updateActivePlayer() {
    if (currentPlayer === "X") {
        playerXLabel.classList.add("active");
        playerOLabel.classList.remove("active");
    } else {
        playerOLabel.classList.add("active");
        playerXLabel.classList.remove("active");
    }
}

function checkWinner() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.find(([a,b,c]) =>
        board[a] && board[a] === board[b] && board[a] === board[c]
    );
}

function highlightWinner(cells) {
    cells.forEach(i => boardEl.children[i].classList.add("winner"));
}

function endGame(type, winner) {
    gameOver = true;
    document.querySelectorAll(".cell").forEach(c => c.classList.add("disabled"));
    
    if (type === "winner") {
        winnerText.textContent = "WINNER";
        winnerSymbol.textContent = winner;
        winnerSymbol.style.display = "block";
        drawSymbols.style.display = "none";
    } else {
        winnerText.textContent = "DRAW";
        winnerSymbol.style.display = "none";
        drawSymbols.style.display = "flex";
    }
    
    overlay.classList.remove("hidden");
}

function playAgain() {
    overlay.classList.add("hidden");
    board = Array(9).fill(null);
    gameOver = false;
    currentPlayer = "X";
    statusEl.textContent = "Player X's Turn";
    createBoard();
    updateActivePlayer();
}

function resetGame() {
    board = Array(9).fill(null);
    gameOver = false;
    currentPlayer = "X";
    statusEl.textContent = "Player X's Turn";
    scores = { X: 0, O: 0 };
    updateScore();
    createBoard();
    updateActivePlayer();
}

function updateScore() {
    scoreX.textContent = scores.X === 0 ? '-' : scores.X;
    scoreO.textContent = scores.O === 0 ? '-' : scores.O;
}

function exitGame() {
    window.location.href = "index.html";
}

createBoard();
