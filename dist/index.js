"use strict";
var _a, _b, _c, _d, _e;
let data = [['', '', ''], ['', '', ''], ['', '', '']];
let mode = 1;
// Mode 1 = human is X, cpu is O
// Mode 2 = human is O, cpu is X
// Mode 3 + 4 = 2 players
let human = true;
let gameOver = false;
let playerTurn = true;
let p1Icon = 'X';
let turn = 1;
let scoreX = 0;
let scoreO = 0;
let scoreT = 0;
let theme = 'dark';
const xIcon = "/assets/icon-x.svg";
const oIcon = "/assets/icon-o.svg";
const xIconOutline = '/assets/icon-x-outline.svg';
const oIconOutline = '/assets/icon-o-outline.svg';
// Setup Document Elements
// Change player 1 icon x or o
(_a = document
    .getElementById("selector-x")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => (p1Icon = 'X'));
(_b = document
    .getElementById("selector-o")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => (p1Icon = 'O'));
// Setup section
const setupSection = document.getElementById("setup");
// Start game buttons
const start1PlayerGame = document.getElementById("one-player-start");
const start2PlayerGame = document.getElementById("two-players-start");
// Board and active game section
const activeSection = document.getElementById("active");
const cells = document.querySelectorAll(".cell");
// Hide active section
activeSection.style.display = "none";
// Identifiers for scores and player types (only innerHTML will be changed)
const turnXIcon = document.getElementById("turn-x-icon");
const turnOIcon = document.getElementById("turn-o-icon");
const xScoreIdentifier = document.getElementById("x-score");
const oScoreIdentifier = document.getElementById("o-score");
const xPlayerIdentifier = document.getElementById("x-type");
const oPlayerIdentifier = document.getElementById("o-type");
const tieScoreIdentifier = document.getElementById("tie-score");
// Restart buttons and bring up restart menu or close menu (cancel)
const restartSection = document.getElementById("restart");
const confirmRestart = document.getElementById("confirm-restart-btn");
(_c = document
    .getElementById("cancel-restart-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => (restartSection.style.display = "none"));
(_d = document
    .getElementById("restart-bg")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => (restartSection.style.display = "none"));
(_e = document
    .getElementById("restart-btn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => (restartSection.style.display = "block"));
// Hide restart section
restartSection.style.display = "none";
// New Game buttons or quit to menu
const nextRoundSection = document.getElementById("next-round");
const confirmNextRound = document.getElementById("confirm-next-round");
const quitToMenu = document.getElementById("quit");
// Hide next round section
nextRoundSection.style.display = "none";
// Game over winner identifiers in New Game Menu (only innerHTML will be changed)
const roundWinnerPlayerIdentifier = document.getElementById("round-winner-name");
const roundWinnerIconIdentifier = document.getElementById("round-winner-icon");
const roundResultMessage = document.getElementById("round-result-message");
// Change icon based on turn
const changeTurnIcon = () => {
    if (turn === 1) {
        turnXIcon.style.display = 'block';
        turnOIcon.style.display = 'none';
    }
    else if (turn === 2) {
        turnXIcon.style.display = 'none';
        turnOIcon.style.display = 'block';
    }
};
// Restart game and next round functions
const newGame = () => {
    // Clear all icons from cells
    cells.forEach((cell) => {
        const img = cell.firstChild;
        if (img) {
            cell.removeChild(img);
        }
    });
    data = [['', '', ''], ['', '', ''], ['', '', '']];
    gameOver = false;
    turn = 1;
    human = mode === 1 || mode === 3 ? true : false;
    changeTurnIcon();
};
const restartGame = () => {
    // Reset all game variables that dont change every round
    scoreO = 0;
    scoreT = 0;
    scoreX = 0;
    // Run new game function to clear board and reset turns (May be redundant as I may run this in the start game function as well)
    newGame();
    // Reset stats on game page
    nextRoundSection.style.display = "none";
    restartSection.style.display = "none";
    tieScoreIdentifier.innerHTML = "0";
    xScoreIdentifier.innerHTML = "0";
    oScoreIdentifier.innerHTML = "0";
    // Quit to main menu
    activeSection.style.display = "none";
    setupSection.style.display = "flex";
};
// Add restart function to restart button and quit button
confirmRestart.addEventListener("click", restartGame);
quitToMenu.addEventListener("click", () => {
    restartGame();
});
// Add new game to click of next game button
confirmNextRound.addEventListener("click", () => {
    nextRoundSection.style.display = "none";
    newGame();
    if (mode === 2) {
        aiTurn();
        turn = 2;
        changeTurnIcon();
        human = true;
        playerTurn = true;
    }
});
// Game start change innerHTML
const gameStartSetup = () => {
    if (mode === 1) {
        // Setup player types
        xPlayerIdentifier.innerHTML = 'YOU';
        oPlayerIdentifier.innerHTML = 'CPU';
    }
    else if (mode === 2) {
        xPlayerIdentifier.innerHTML = 'CPU';
        oPlayerIdentifier.innerHTML = 'YOU';
    }
    else if (mode === 3) {
        xPlayerIdentifier.innerHTML = 'P1';
        oPlayerIdentifier.innerHTML = 'P2';
    }
    else {
        xPlayerIdentifier.innerHTML = 'P2';
        oPlayerIdentifier.innerHTML = 'P1';
    }
};
const handle1PGame = () => {
    p1Icon === 'X' ? mode = 1 : mode = 2;
    gameStartSetup();
    newGame();
    setupSection.style.display = "none";
    activeSection.style.display = "flex";
    if (mode === 2) {
        aiTurn();
        turn = 2;
        changeTurnIcon();
        human = true;
    }
    playerTurn = true;
    cells.forEach((cell) => cell.addEventListener("click", (e) => handleCellClick(e)));
};
const handle2PGame = () => {
    p1Icon === 'X' ? mode = 3 : mode = 4;
    gameStartSetup();
    newGame();
    playerTurn = true;
    setupSection.style.display = "none";
    activeSection.style.display = "flex";
    cells.forEach((cell) => cell.addEventListener("click", (e) => handleCellClick(e)));
};
start1PlayerGame.addEventListener('click', handle1PGame);
start2PlayerGame.addEventListener('click', handle2PGame);
const aiTurn = () => {
    var _a;
    const aiIcon = mode === 1 ? 'O' : 'X';
    let bestScore = -Infinity;
    let bestMove = { x: 0, y: 0 };
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (data[x][y] === '') {
                data[x][y] = aiIcon;
                let score = minimax(false);
                data[x][y] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { x, y };
                }
            }
        }
    }
    data[bestMove.x][bestMove.y] = aiIcon;
    let icon = mode === 2 ? 'X' : 'O';
    const img = document.createElement("img");
    img.src = icon === "X" ? xIcon : oIcon;
    (_a = document.getElementById(String(bestMove.x) + String(bestMove.y))) === null || _a === void 0 ? void 0 : _a.appendChild(img);
};
const minimax = (isMaximizing, alpha = -Infinity, beta = Infinity) => {
    let result = winner('minimax');
    if (result !== null) {
        return result === 'X' ? mode === 1 ? -1 : 1 : result === 'O' ? mode === 1 ? 1 : -1 : 0;
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (data[x][y] === '') {
                    data[x][y] = mode === 1 ? 'O' : 'X';
                    let score = minimax(false, alpha, beta);
                    data[x][y] = '';
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
    else {
        let bestScore = Infinity;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (data[x][y] === '') {
                    data[x][y] = mode === 1 ? 'X' : 'O';
                    let score = minimax(true, alpha, beta);
                    data[x][y] = '';
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
};
const winner = (mode) => {
    let player;
    let availableSpots = 0;
    if (mode === 'minimax') {
        player = 'X';
        if (data[0][0] === data[0][1] && data[0][1] === data[0][2] && data[0][2] === player ||
            data[1][0] === data[1][1] && data[1][1] === data[1][2] && data[1][2] === player ||
            data[2][0] === data[2][1] && data[2][1] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][0] && data[1][0] === data[2][0] && data[2][0] === player ||
            data[0][1] === data[1][1] && data[1][1] === data[2][1] && data[2][1] === player ||
            data[0][2] === data[1][2] && data[1][2] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][1] && data[1][1] === data[2][2] && data[2][2] === player ||
            data[2][0] === data[1][1] && data[1][1] === data[0][2] && data[0][2] === player) {
            return 'X';
        }
        player = 'O';
        if (data[0][0] === data[0][1] && data[0][1] === data[0][2] && data[0][2] === player ||
            data[1][0] === data[1][1] && data[1][1] === data[1][2] && data[1][2] === player ||
            data[2][0] === data[2][1] && data[2][1] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][0] && data[1][0] === data[2][0] && data[2][0] === player ||
            data[0][1] === data[1][1] && data[1][1] === data[2][1] && data[2][1] === player ||
            data[0][2] === data[1][2] && data[1][2] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][1] && data[1][1] === data[2][2] && data[2][2] === player ||
            data[2][0] === data[1][1] && data[1][1] === data[0][2] && data[0][2] === player) {
            return 'O';
        }
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (data[x][y] === '') {
                    availableSpots++;
                }
            }
        }
        if (availableSpots === 0) {
            return 'T';
        }
        return null;
    }
    else if (mode === 'check') {
        player = 'X';
        if (data[0][0] === data[0][1] && data[0][1] === data[0][2] && data[0][2] === player ||
            data[1][0] === data[1][1] && data[1][1] === data[1][2] && data[1][2] === player ||
            data[2][0] === data[2][1] && data[2][1] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][0] && data[1][0] === data[2][0] && data[2][0] === player ||
            data[0][1] === data[1][1] && data[1][1] === data[2][1] && data[2][1] === player ||
            data[0][2] === data[1][2] && data[1][2] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][1] && data[1][1] === data[2][2] && data[2][2] === player ||
            data[2][0] === data[1][1] && data[1][1] === data[0][2] && data[0][2] === player) {
            scoreX += 1;
            xScoreIdentifier.innerHTML = String(scoreX);
            gameOver = true;
            handleGameOver('X');
            return;
        }
        player = 'O';
        if (data[0][0] === data[0][1] && data[0][1] === data[0][2] && data[0][2] === player ||
            data[1][0] === data[1][1] && data[1][1] === data[1][2] && data[1][2] === player ||
            data[2][0] === data[2][1] && data[2][1] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][0] && data[1][0] === data[2][0] && data[2][0] === player ||
            data[0][1] === data[1][1] && data[1][1] === data[2][1] && data[2][1] === player ||
            data[0][2] === data[1][2] && data[1][2] === data[2][2] && data[2][2] === player ||
            data[0][0] === data[1][1] && data[1][1] === data[2][2] && data[2][2] === player ||
            data[2][0] === data[1][1] && data[1][1] === data[0][2] && data[0][2] === player) {
            scoreO += 1;
            oScoreIdentifier.innerHTML = String(scoreO);
            gameOver = true;
            handleGameOver('O');
            return;
        }
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (data[x][y] === '') {
                    availableSpots++;
                }
            }
        }
        if (availableSpots === 0) {
            scoreT += 1;
            tieScoreIdentifier.innerHTML = String(scoreT);
            gameOver = true;
            handleGameOver('T');
            return;
        }
    }
};
const handleCellClick = (e) => {
    if (!playerTurn)
        return;
    const cell = e.target;
    const cellIndexString = cell.getAttribute("data-cell-index");
    if (cellIndexString === null)
        return;
    const x = parseInt(cellIndexString[0]);
    const y = parseInt(cellIndexString[1]);
    move(cell, x, y);
};
const move = (cell, x, y) => {
    let icon = turn === 1 ? 'X' : 'O';
    const img = document.createElement("img");
    img.src = icon === "X" ? xIcon : oIcon;
    if (gameOver) {
        return;
    }
    if (human) {
        if (data[x][y] !== '')
            return;
        cell.appendChild(img);
        cell.style.backgroundImage = '';
        data[x][y] = icon;
        human = false;
        winner('check');
        if (gameOver)
            return;
        turn === 1 ? turn = 2 : turn = 1;
        changeTurnIcon();
    }
    else if (!human && mode >= 3) {
        if (data[x][y] !== '')
            return;
        cell.appendChild(img);
        cell.style.backgroundImage = '';
        data[x][y] = icon;
        human = true;
        winner('check');
        if (gameOver)
            return;
        turn === 1 ? turn = 2 : turn = 1;
        changeTurnIcon();
    }
    if (!human && mode <= 2) {
        playerTurn = false;
        changeTurnIcon();
        setTimeout(() => {
            aiTurn();
            human = true;
            turn === 1 ? turn = 2 : turn = 1;
            winner('check');
            if (gameOver)
                return;
            changeTurnIcon();
            playerTurn = true;
        }, 1000);
    }
};
const handleGameOver = (result) => {
    if (result !== 'T') {
        roundWinnerIconIdentifier.src = result === 'X' ? xIcon : oIcon;
        roundWinnerPlayerIdentifier.innerHTML = (mode === 1 && result === 'X') || (mode === 2 && result === 'O') ? 'YOU WON!' : (mode === 1 && result === 'O') || (mode === 2 && result === 'X') ? 'OH NO, YOU LOST...' : `PLAYER ${(mode === 3 && result === 'X') || (mode === 4 && result === 'O') ? '1' : '2'} WINS!`;
        roundResultMessage.innerHTML = "TAKES THE ROUND";
        roundWinnerIconIdentifier.style.display = "block";
        roundResultMessage.style.color = result === 'X' ? 'var(--blue-main)' : 'var(--yellow-main)';
        nextRoundSection.style.display = "block";
    }
    else if (result === 'T') {
        roundWinnerPlayerIdentifier.innerHTML = "";
        roundWinnerIconIdentifier.style.display = "none";
        roundResultMessage.innerHTML = "ROUND TIED";
        roundResultMessage.style.color = 'var(--slate-main)';
        nextRoundSection.style.display = "block";
    }
};
roundResultMessage.style.color = '#31C3BD;';
// styling
const buttons = document.querySelectorAll('button');
buttons.forEach(button => button.addEventListener('click', () => {
    button.classList.add('click-animation');
    setTimeout(() => {
        button.classList.remove('click-animation');
    }, 100);
}));
// Handle hover on cells
const cellHover = (e) => {
    if (!playerTurn || gameOver)
        return;
    const cell = e.target;
    const cellIndexString = cell.getAttribute("data-cell-index");
    if (cellIndexString === null)
        return;
    const x = parseInt(cellIndexString[0]);
    const y = parseInt(cellIndexString[1]);
    if (data[x][y] !== '')
        return;
    const bg = turn === 1 ? xIconOutline : oIconOutline;
    if (e.type === 'mouseenter') {
        cell.style.backgroundImage = `url(${bg})`;
    }
    else if (e.type === 'mouseleave' || 'click') {
        cell.style.backgroundImage = '';
    }
};
cells.forEach((cell) => cell.addEventListener('mouseenter', (e) => cellHover(e)));
cells.forEach((cell) => cell.addEventListener('mouseleave', (e) => cellHover(e)));
