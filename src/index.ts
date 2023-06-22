let data: (''|'X'|'O')[][] = [['','',''],['','',''],['','','']]
let mode: 1|2|3|4 = 1
// Mode 1 = human is X, cpu is O
// Mode 2 = human is O, cpu is X
// Mode 3 = 2 players
let human: boolean = true
let gameOver: boolean = false
let p1Icon: 'X'|'O' = 'X'
let turn: 1|2 = 1
let scoreX = 0
let scoreO = 0
let scoreT = 0
let theme: 'dark' | 'light' = 'dark'

const xIcon: string = "/assets/icon-x.svg";
const oIcon: string = "/assets/icon-o.svg";

// Setup Document Elements
// Change player 1 icon x or o
document
	.getElementById("selector-x")
	?.addEventListener("click", () => (p1Icon = 'X'));
document
	.getElementById("selector-o")
	?.addEventListener("click", () => (p1Icon = 'O'));

// Setup section
const setupSection = document.getElementById("setup")!;

// Start game buttons
const start1PlayerGame = document.getElementById("one-player-start")!;
const start2PlayerGame = document.getElementById("two-players-start")!;

// Board and active game section
const activeSection = document.getElementById("active")!;
const cells = document.querySelectorAll(".cell")!;
// Hide active section
activeSection.style.display = "none";

// Identifiers for scores and player types (only innerHTML will be changed)
const currentTurnIdentifier = document.getElementById("current-turn")!;
const xScoreIdentifier = document.getElementById("x-score")!;
const oScoreIdentifier = document.getElementById("o-score")!;
const xPlayerIdentifier = document.getElementById("x-type")!;
const oPlayerIdentifier = document.getElementById("o-type")!;
const tieScoreIdentifier = document.getElementById("tie-score")!;

// Restart buttons and bring up restart menu or close menu (cancel)
const restartSection = document.getElementById("restart")!;
const confirmRestart = document.getElementById("confirm-restart-btn")!;
document
	.getElementById("cancel-restart-btn")
	?.addEventListener("click", () => (restartSection.style.display = "none"));
document
	.getElementById("restart-bg")
	?.addEventListener("click", () => (restartSection.style.display = "none"));
document
	.getElementById("restart-btn")
	?.addEventListener("click", () => (restartSection.style.display = "block"));
// Hide restart section
restartSection.style.display = "none";

// New Game buttons or quit to menu
const nextRoundSection = document.getElementById("next-round")!;
const confirmNextRound = document.getElementById("confirm-next-round")!;
const quitToMenu = document.getElementById("quit")!;
// Hide next round section
nextRoundSection.style.display = "none";

// Game over winner identifiers in New Game Menu (only innerHTML will be changed)
const roundWinnerPlayerIdentifier =
	document.getElementById("round-winner-name")!;
const roundWinnerIconIdentifier = document.getElementById(
	"round-winner-icon"
)! as HTMLImageElement;
const roundResultMessage = document.getElementById("round-result-message")!;

// Restart game and next round functions
const newGame = () => {
	// Clear all icons from cells
	cells.forEach((cell) => {
		const img = cell.firstChild;
		if (img) {
			cell.removeChild(img);
		}
	});
	data = [['','',''],['','',''],['','','']]
	gameOver = false
	turn = 1
	human = mode === 1 || mode === 3 ? true : false
}

const restartGame = () => {
	// Reset all game variables that dont change every round
	scoreO = 0
	scoreT = 0
	scoreX = 0
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
	setupSection.style.display = "block";
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
		aiTurn()
		turn = 2
		human = true
	}
});

// Game start change innerHTML
const gameStartSetup = () => {
	if (mode === 1) {
		// Setup player types
		xPlayerIdentifier.innerHTML = 'YOU'
		oPlayerIdentifier.innerHTML = 'CPU'
	} else if (mode === 2) {
		xPlayerIdentifier.innerHTML = 'CPU'
		oPlayerIdentifier.innerHTML = 'YOU'
	} else if (mode === 3) {
		xPlayerIdentifier.innerHTML = 'P1'
		oPlayerIdentifier.innerHTML = 'P2'
	} else {
		xPlayerIdentifier.innerHTML = 'P2'
		oPlayerIdentifier.innerHTML = 'P1'
	}
};

const handle1PGame = () => {
	p1Icon === 'X' ? mode = 1 : mode = 2
	gameStartSetup()
	newGame()
	setupSection.style.display = "none";
	activeSection.style.display = "block";
	if (mode === 2) {
		aiTurn()
		turn = 2
		human = true
	}
}

const handle2PGame = () => {
	p1Icon === 'X' ? mode = 3 : mode = 4
	gameStartSetup()
	newGame()
	setupSection.style.display = "none";
	activeSection.style.display = "block";
}

start1PlayerGame.addEventListener('click', handle1PGame)
start2PlayerGame.addEventListener('click', handle2PGame)

const aiTurn = () => {
	const aiIcon = mode === 1 ? 'O' : 'X'
	let bestScore = -Infinity
	let bestMove: {x: number, y: number} = {x: 0, y: 0}
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (data[x][y] === '') {
				data[x][y] = aiIcon
				let score: number = minimax(false)
				data[x][y] = ''
				if (score > bestScore) {
					bestScore = score;
					bestMove = {x, y}
				}
			}
		}
		
	}
	data[bestMove.x][bestMove.y] = aiIcon
	let icon: 'X' | 'O' = mode === 2 ? 'X' : 'O'
	const img = document.createElement("img");
	img.src = icon === "X" ? xIcon : oIcon;
	document.getElementById(String(bestMove.x) + String(bestMove.y))?.appendChild(img)
}

const minimax = (isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
	let result = winner('minimax')
	if (result !== null) {
		return result === 'X' ? mode === 1 ? -1 : 1 : result === 'O' ? mode === 1 ? 1 : -1 : 0
	}
	if (isMaximizing) {
		let bestScore = -Infinity
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				if (data[x][y] === '') {
					data[x][y] = mode === 1 ? 'O' : 'X'
					let score = minimax(false, alpha, beta)
					data[x][y] = ''
					bestScore = Math.max(score, bestScore)
					alpha = Math.max(alpha, score)
					if (beta <= alpha) {
						break
					}
				}
			}
		}
		return bestScore
	} else {
		let bestScore = Infinity
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
			  if (data[x][y] === '') {
				data[x][y] = mode === 1 ? 'X': 'O';
				let score = minimax(true, alpha, beta);
				data[x][y] = '';
				bestScore = Math.min(score, bestScore);
				beta = Math.min(beta,score);
				if (beta <= alpha) {
				  break;
				}
			  }
			}
		  }
		return bestScore;
	}
}

const winner = (mode: string) => {
	let player
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
				availableSpots++
			}
		}
	}
	if (availableSpots === 0) {
		return 'T'
	}
	return null
} else if (mode === 'check') {
	player = 'X';
	if (data[0][0] === data[0][1] && data[0][1] === data[0][2] && data[0][2] === player ||
		data[1][0] === data[1][1] && data[1][1] === data[1][2] && data[1][2] === player ||
		data[2][0] === data[2][1] && data[2][1] === data[2][2] && data[2][2] === player ||
		data[0][0] === data[1][0] && data[1][0] === data[2][0] && data[2][0] === player ||
		data[0][1] === data[1][1] && data[1][1] === data[2][1] && data[2][1] === player ||
		data[0][2] === data[1][2] && data[1][2] === data[2][2] && data[2][2] === player ||
		data[0][0] === data[1][1] && data[1][1] === data[2][2] && data[2][2] === player ||
		data[2][0] === data[1][1] && data[1][1] === data[0][2] && data[0][2] === player) {
	  scoreX+=1;
	  xScoreIdentifier.innerHTML = String(scoreX)
	  gameOver = true;
	  handleGameOver('X')
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
	  scoreO+=1;
	  oScoreIdentifier.innerHTML = String(scoreO)
	  gameOver = true;
	  handleGameOver('O')
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
	  scoreT+=1;
	  tieScoreIdentifier.innerHTML = String(scoreT)
	  gameOver = true;
	  handleGameOver('T')
	  return;
	}
  }
}

const handleCellClick = (e: Event) => {
	const cell: Element = <Element>e.target;
	const cellIndexString: string | null = cell.getAttribute("data-cell-index");
	if (cellIndexString === null) return;
	const x = parseInt(cellIndexString[0])
	const y = parseInt(cellIndexString[1])
	move(cell, x, y)
}

const move = (cell: Element, x: number, y: number) => {
	let icon: 'X' | 'O' = turn === 1 ? 'X' : 'O'
	const img = document.createElement("img");
	img.src = icon === "X" ? xIcon : oIcon;
	if (gameOver) {
		return
	}
	if (human) {
		if (data[x][y] !== '') return
		cell.appendChild(img)
		data[x][y] = icon
		human = false
		winner('check')
		if (gameOver) return
		turn === 1 ? turn = 2 : turn = 1
	} else if (!human) {
		if (mode > 2) {
			if (data[x][y] !== '') return
			cell.appendChild(img)
			data[x][y] = icon
			human = true
			turn === 1 ? turn = 2 : turn = 1
		}
	}
	if (!human && mode <= 2) {
		aiTurn()
		human = true
		turn === 1 ? turn = 2 : turn = 1
	}
	winner('check')
	if (gameOver) return
}
cells.forEach((cell) => cell.addEventListener("click", (e) => handleCellClick(e)));

const handleGameOver = (result: 'X'| 'O' | 'T') => {
	if (result !== 'T') {
		roundWinnerIconIdentifier.src = result === 'X' ? xIcon : oIcon
		roundWinnerPlayerIdentifier.innerHTML = (mode === 1 && result === 'X') || (mode === 2 && result === 'O') ? 'YOU WON!' : (mode === 1 && result === 'O') || (mode === 2 && result === 'X') ? 'OH NO, YOU LOST...' : `PLAYER ${(mode === 3 && result === 'X') || (mode === 4 && result === 'O') ? '1' : '2'} WINS!`;
		roundResultMessage.innerHTML = "TAKES THE ROUND";
		roundWinnerIconIdentifier.style.display = "block";
		nextRoundSection.style.display = "block";
	} else if (result === 'T') {
		roundWinnerPlayerIdentifier.innerHTML = "";
		roundWinnerIconIdentifier.style.display = "none";
		roundResultMessage.innerHTML = "ROUND TIED";
		nextRoundSection.style.display = "block";
	}
}












// type Player = {

// 	type: "human" | "cpu";
// 	icon: "X" | "O";
// 	wins: number;
// };
// type CellValue = number | "X" | "O";
// interface BoardState {
// 	cells: (CellValue)[];
// 	currentPlayer: number | 1 | 2;
// }
// type GameBoard = (number | "X" | "O")[]
// let board: GameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// let numberOfPlayers: 1 | 2 = 1;
// let player1: Player = {
// 	type: "human",
// 	icon: "X",
// 	wins: 0,
// };
// let player2: Player = {
// 	type: "cpu",
// 	icon: "O",
// 	wins: 0,
// };
// let currentPlayerTurn: number = 1 | 2;
// let ties: number = 0;
// let iter: number = 0;
// let gameActive: boolean = false;

// // X and O icons for adding to board
// const xIcon: string = "/assets/icon-x.svg";
// const oIcon: string = "/assets/icon-o.svg";

// // Win combos
// const winCombos: number[][] = [
// 	[0, 1, 2],
// 	[3, 4, 5],
// 	[6, 7, 8], // rows
// 	[0, 3, 6],
// 	[1, 4, 7],
// 	[2, 5, 8], // columns
// 	[0, 4, 8],
// 	[2, 4, 6], // diagonals
// ];

// // Setup Document Elements
// // Change player 1 icon x or o
// document
// 	.getElementById("selector-x")
// 	?.addEventListener("click", () => (player1.icon = "X"));
// document
// 	.getElementById("selector-o")
// 	?.addEventListener("click", () => (player1.icon = "O"));

// // Setup section
// const setupSection = document.getElementById("setup")!;

// // Start game buttons
// const start1PlayerGame = document.getElementById("one-player-start")!;
// const start2PlayerGame = document.getElementById("two-players-start")!;

// // Board and active game section
// const activeSection = document.getElementById("active")!;
// const cells = document.querySelectorAll(".cell")!;
// // Hide active section
// activeSection.style.display = "none";

// // Identifiers for scores and player types (only innerHTML will be changed)
// const currentTurnIdentifier = document.getElementById("current-turn")!;
// const xScoreIdentifier = document.getElementById("x-score")!;
// const oScoreIdentifier = document.getElementById("o-score")!;
// const xPlayerIdentifier = document.getElementById("x-type")!;
// const oPlayerIdentifier = document.getElementById("o-type")!;
// const tieScoreIdentifier = document.getElementById("tie-score")!;

// // Restart buttons and bring up restart menu or close menu (cancel)
// const restartSection = document.getElementById("restart")!;
// const confirmRestart = document.getElementById("confirm-restart-btn")!;
// document
// 	.getElementById("cancel-restart-btn")
// 	?.addEventListener("click", () => (restartSection.style.display = "none"));
// document
// 	.getElementById("restart-bg")
// 	?.addEventListener("click", () => (restartSection.style.display = "none"));
// document
// 	.getElementById("restart-btn")
// 	?.addEventListener("click", () => (restartSection.style.display = "block"));
// // Hide restart section
// restartSection.style.display = "none";

// // New Game buttons or quit to menu
// const nextRoundSection = document.getElementById("next-round")!;
// const confirmNextRound = document.getElementById("confirm-next-round")!;
// const quitToMenu = document.getElementById("quit")!;
// // Hide next round section
// nextRoundSection.style.display = "none";

// // Game over winner identifiers in New Game Menu (only innerHTML will be changed)
// const roundWinnerPlayerIdentifier =
// 	document.getElementById("round-winner-name")!;
// const roundWinnerIconIdentifier = document.getElementById(
// 	"round-winner-icon"
// )! as HTMLImageElement;
// const roundResultMessage = document.getElementById("round-result-message")!;

// // Restart game and next round functions
// const newGame = () => {
// 	// Clear all icons from cells
// 	cells.forEach((cell) => {
// 		const img = cell.firstChild;
// 		if (img) {
// 			cell.removeChild(img);
// 		}
// 	});
// 	// Set current turn and identifier to X
// 	currentPlayerTurn = player1.icon === "X" ? 1 : 2;
// 	currentTurnIdentifier.innerHTML = "X";
// 	// Reset the board and turn count
// 	board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// 	iter = 0;
// };

// const restartGame = () => {
// 	// Reset all game variables that dont change every round
// 	numberOfPlayers = 1;
// 	player1 = {
// 		type: "human",
// 		icon: "X",
// 		wins: 0,
// 	};
// 	player2 = {
// 		type: "cpu",
// 		icon: "O",
// 		wins: 0,
// 	};
// 	ties = 0;
// 	// Run new game function to clear board and reset turns (May be redundant as I may run this in the start game function as well)
// 	newGame();
// 	// Reset stats on game page
// 	nextRoundSection.style.display = "none";
// 	restartSection.style.display = "none";
// 	tieScoreIdentifier.innerHTML = "0";
// 	xScoreIdentifier.innerHTML = "0";
// 	oScoreIdentifier.innerHTML = "0";
// 	// Quit to main menu
// 	activeSection.style.display = "none";
// 	setupSection.style.display = "block";
// };

// // Add restart function to restart button and quit button
// confirmRestart.addEventListener("click", restartGame);
// quitToMenu.addEventListener("click", () => {
// 	restartGame();
// });
// // Add new game to click of next game button
// confirmNextRound.addEventListener("click", () => {
// 	nextRoundSection.style.display = "none";
// 	newGame();
// 	gameActive = true;
// });

// // Game start change innerHTML
// const gameStartSetup = () => {
// 	player2.icon = player1.icon === "X" ? "O" : "X";
// 	if (numberOfPlayers === 1) {
// 		player2.type = "cpu";
// 		// Setup player types
// 		xPlayerIdentifier.innerHTML = player1.icon === "X" ? "YOU" : "CPU";
// 		oPlayerIdentifier.innerHTML = player1.icon === "O" ? "YOU" : "CPU";
// 	} else {
// 		player2.type = "human";
// 		xPlayerIdentifier.innerHTML = player1.icon === "X" ? "P1" : "P2";
// 		oPlayerIdentifier.innerHTML = player1.icon === "O" ? "P1" : "P2";
// 	}
// };

// // Check win
// const checkPlayerWin = (icon: "X" | "O"): boolean => {
// 	let win: boolean = false;
// 	for (let i = 0; i < winCombos.length; i++) {
// 		const [a, b, c] = winCombos[i];
// 		if (board[a] === icon && board[b] === icon && board[c] === icon) {
// 			win = true;
// 			break;
// 		} else {
// 			win = false;
// 		}
// 	}
// 	return win;
// };

// // Handle a player turn
// const playerTurn = (e: Event) => {
// 	const cell: Element = <Element>e.target;
// 	const cellIndexString: string | null = cell.getAttribute("data-cell-index");
// 	if (cellIndexString === null) return;
// 	const cellIndex = parseInt(cellIndexString);
// 	let icon: "X" | "O" =
// 		currentPlayerTurn === 1
// 			? player1.icon === "X"
// 				? "X"
// 				: "O"
// 			: player2.icon === "X"
// 			? "X"
// 			: "O";
// 	if (typeof board[cellIndex] === "number" && gameActive) {
// 		board.splice(cellIndex, 1, icon);
// 		const img = document.createElement("img");
// 		img.src = icon === "X" ? xIcon : oIcon;
// 		cells[cellIndex].appendChild(img);
// 	} else return;
// 	if (checkPlayerWin(icon)) {
// 		gameActive = false;
// 		const player1Wins = () => {
// 			player1.wins += 1;
// 			player1.icon === "X"
// 				? (xScoreIdentifier.innerHTML = player1.wins.toString())
// 				: (oScoreIdentifier.innerHTML = player1.wins.toString());
// 			roundWinnerPlayerIdentifier.innerHTML = "PLAYER 1 WINS!";
// 			roundResultMessage.innerHTML = "TAKES THE ROUND";
// 			roundWinnerIconIdentifier.src = player1.icon === "X" ? xIcon : oIcon;
// 		};
// 		const player2Wins = () => {
// 			player2.wins += 1;
// 			player2.icon === "X"
// 				? (xScoreIdentifier.innerHTML = player2.wins.toString())
// 				: (oScoreIdentifier.innerHTML = player2.wins.toString());
// 			roundWinnerPlayerIdentifier.innerHTML = "PLAYER 2 WINS!";
// 			roundResultMessage.innerHTML = "TAKES THE ROUND";
// 			roundWinnerIconIdentifier.src = player2.icon === "X" ? xIcon : oIcon;
// 		};
// 		icon === player1.icon ? player1Wins() : player2Wins();
// 		// Bring up win message
// 		roundWinnerIconIdentifier.style.display = "block";
// 		nextRoundSection.style.display = "block";
// 	}
// 	if (
// 		board.every((cell) => typeof cell === "string" && !checkPlayerWin(icon))
// 	) {
// 		gameActive = false;
// 		ties += 1;
// 		tieScoreIdentifier.innerHTML = ties.toString();
// 		roundWinnerPlayerIdentifier.innerHTML = "";
// 		roundWinnerIconIdentifier.style.display = "none";
// 		roundResultMessage.innerHTML = "ROUND TIED";
// 		nextRoundSection.style.display = "block";
// 	} else {
// 		currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;
// 	}
// };

// // One player game function

// // Two player game function
// const twoPlayerGame = () => {
// 	numberOfPlayers = 2;
// 	// Set Game active and clear board
// 	gameActive = true;
// 	newGame();
// 	gameStartSetup();
// 	// Add cell event listeners
// 	cells.forEach((cell) => cell.addEventListener("click", (e) => playerTurn(e)));
// 	// Hide start page and show game
// 	setupSection.style.display = "none";
// 	activeSection.style.display = "block";
// };

// start2PlayerGame.addEventListener("click", twoPlayerGame);

// // 1 Player game

// const calculateScore = (board: BoardState): number | null => {
// 	for (let i = 0; i < winCombos.length; i++) {
// 		const [a, b, c] = winCombos[i];
// 		if (
// 			board.cells[a] &&
// 			board.cells[a] === board.cells[b] &&
// 			board.cells[a] === board.cells[c]
// 		) {
// 			console.log(board, [a,b,c],[board.cells[a],board.cells[b],board.cells[c]], player2.icon === board.cells[a] ? 1 : -1)
// 			return board.cells[a] === player2.icon ? 1 : -1;
// 		}
// 	}
// 	if (board.cells.every((cell) => typeof cell === "string")) {
// 		return 0;
// 	}
// 	console.log('null', board)
// 	return null;
// };

// const winningCells = (board: GameBoard, player: 'X' | 'O'): boolean => {
// 	var win: boolean = false
// 	for (let i = 0; i < winCombos.length; i++) {
// 		const [a,b,c] = winCombos[i]
// 		if (board[a] === player && board[b] === player && board[c] === player) {
// 			win = true
// 		}
// 	}
// 	return win
// }

// const minimax = (board: BoardState, depth: number, maximizingPlayer: boolean): number => {
// 	const score = calculateScore(board)
// 	if (score !== null) {
// 		return score
// 	}

// 	const cellValue = maximizingPlayer ? player1.icon : player2.icon
// 	let bestScore = maximizingPlayer ? -Infinity : Infinity

// 	for (let i = 0; i < board.cells.length; i++) {
// 		if (typeof board.cells[i] === 'number') {
// 			const newCells = [...board.cells]
// 			newCells[i] = cellValue

// 			const newBoard = {
// 				cells: newCells,
// 				currentPlayer: board.currentPlayer === 1 ? 2 : 1
// 			}
// 			console.log('DEPTH', depth)
// 			const childScore = minimax(newBoard, depth + 1, !maximizingPlayer)

// 			if (maximizingPlayer) {
// 				bestScore = Math.max(bestScore, childScore)
// 			} else {
// 				bestScore = Math.min(bestScore, childScore)
// 			}
// 		}
		
// 	}
// 	return bestScore
// };

// const getBestCell = (boardState: BoardState): number => {
// 	let bestScore = -Infinity
// 	let bestMove = -1

// 	for (let i = 0; i < boardState.cells.length; i++) {
// 		if (typeof boardState.cells[i] === 'number') {
// 			const newCells = [...boardState.cells]
// 			newCells[i] = player2.icon

// 			const newBoard = {
// 				cells: newCells,
// 				currentPlayer: boardState.currentPlayer === 1 ? 2 : 1
// 			}
// 			const score = minimax(newBoard, 0, false)
// 			if (score > bestScore) {
// 				bestScore = score;
// 				bestMove = i
// 			}
// 		}
// 	}
// 	console.log(bestMove)
// 	return bestMove
// };

// const singlePlayerTurn = (e: Event): void => {
// 	const cell: Element = <Element>e.target;
// 	const cellIndexString: string | null = cell.getAttribute("data-cell-index");
// 	if (cellIndexString === null) return;
// 	const cellIndex = parseInt(cellIndexString);
// 	let icon: "X" | "O" = player1.icon;
// 	if (typeof board[cellIndex] === "number" && gameActive) {
// 		board.splice(cellIndex, 1, icon);
// 		const img = document.createElement("img");
// 		img.src = icon === "X" ? xIcon : oIcon;
// 		cells[cellIndex].appendChild(img);
// 	} else return;
// 	if (checkPlayerWin(icon)) {
// 		gameActive = false;
// 		player1.wins += 1;
// 		player1.icon === "X"
// 			? (xScoreIdentifier.innerHTML = player1.wins.toString())
// 			: (oScoreIdentifier.innerHTML = player1.wins.toString());
// 		roundWinnerPlayerIdentifier.innerHTML = "YOU WON!";
// 		roundResultMessage.innerHTML = "TAKES THE ROUND";
// 		roundWinnerIconIdentifier.src = player1.icon === "X" ? xIcon : oIcon;
// 		roundWinnerIconIdentifier.style.display = 'block'
// 		nextRoundSection.style.display = 'block'
// 	} 
// 	else if (
// 		board.every((cell) => typeof cell === "string" && !checkPlayerWin(icon))
// 	) {
// 		gameActive = false;
// 		ties += 1;
// 		tieScoreIdentifier.innerHTML = ties.toString();
// 		roundWinnerPlayerIdentifier.innerHTML = "";
// 		roundWinnerIconIdentifier.style.display = "none";
// 		roundResultMessage.innerHTML = "ROUND TIED";
// 		nextRoundSection.style.display = "block";
// 	} else {
// 		gameActive = false
// 		const boardState: BoardState = {
// 			cells: board,
// 			currentPlayer: player1.icon === 'X' ? 1 : 2
// 		}
// 		const cpuCell = getBestCell(boardState)
// 		board.splice(cpuCell, 1, player2.icon === 'X' ? 'X' : 'O')
// 		const img = document.createElement("img");
// 		img.src = player2.icon === "X" ? xIcon : oIcon;
// 		cells[cpuCell].appendChild(img);
// 		gameActive = true
// 	}
// };

// const onePlayerGame = () => {
// 	numberOfPlayers = 1;
// 	newGame();
// 	gameStartSetup();
// 	console.log(player1, player2);
// 	// Hide start page and show game
// 	setupSection.style.display = "none";
// 	activeSection.style.display = "block";
// 	if (player1.icon === "X") {
// 		gameActive = true;
// 		cells.forEach((cell) =>
// 			cell.addEventListener("click", (e) => singlePlayerTurn(e))
// 		);
// 	}
// };

// start1PlayerGame.addEventListener("click", onePlayerGame);
// type CellValue = "X" | "O" | null;

// interface BoardState {
//   cells: CellValue[];
//   currentPlayer: "X" | "O";
// }

// function minmax(board: BoardState, depth: number, maximizingPlayer: boolean): number {
//   const score = calculateScore(board, depth);

//   if (score !== null) {
//     return score;
//   }

//   const cellValue = maximizingPlayer ? "X" : "O";
//   const scores = [];

//   for (let i = 0; i < board.cells.length; i++) {
//     if (board.cells[i] === null) {
//       const newCells = [...board.cells];
//       newCells[i] = cellValue;

//       const newBoard = {
//         cells: newCells,
//         currentPlayer: board.currentPlayer === "X" ? "O" : "X"
//       };

//       const childScore = minmax(newBoard, depth + 1, !maximizingPlayer);
//       scores.push(childScore);
//     }
//   }

//   return maximizingPlayer ? Math.max(...scores) : Math.min(...scores);
// }

// function getBestCell(board: BoardState): number {
//   const cellValue = board.currentPlayer;
//   const scores = [];

//   for (let i = 0; i < board.cells.length; i++) {
//     if (board.cells[i] === null) {
//       const newCells = [...board.cells];
//       newCells[i] = cellValue;

//       const newBoard = {
//         cells: newCells,
//         currentPlayer: board.currentPlayer === "X" ? "O" : "X"
//       };

//       const score = minmax(newBoard, 0, false);
//       scores.push({ index: i, score });
//     }
//   }

//   // Choose the cell with the highest score
//   const bestScore = Math.max(...scores.map((s) => s.score));
//   const bestMoves = scores.filter((s) => s.score === bestScore);
//   const randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
//   return randomMove.index;
// }
