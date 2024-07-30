const boxs = document.querySelectorAll('.box');
const statusTxt = document.querySelector('#status');
const btnRestart = document.querySelector('#restart');
let x = "<p class='x'></p>";
let o = "<p class='o'></p>";

const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = x;
let running = false;
let player = "X";
let isHumanTurn = true;

init();

function init() {
    boxs.forEach(box => box.addEventListener('click', boxClick));
    running = true;
    btnRestart.addEventListener('click', restartGame);
    statusTxt.textContent = `${player} Your Turn`;
}

function boxClick() {
    const index = this.dataset.index;
    if (options[index] !== "" || !running || !isHumanTurn) {
        return;
    }
    updateBox(this, index);
    checkWinner();
    if (running) {
        isHumanTurn = false;
        setTimeout(handleAIMove, 500); // AI makes a move after a short delay
    }
}

function updateBox(box, index) {
    options[index] = player;
    box.innerHTML = currentPlayer;
}

function changePlayer() {
    player = (player === "X") ? "O" : "X";
    currentPlayer = (currentPlayer === x) ? o : x;
    statusTxt.textContent = `${player} Your Turn`;
}

function checkWinner() {
    let isWon = false;
    for (let i = 0; i < win.length; i++) {
        const condition = win[i];
        const box1 = options[condition[0]];
        const box2 = options[condition[1]];
        const box3 = options[condition[2]];
        if (box1 === "" || box2 === "" || box3 === "") {
            continue;
        }
        if (box1 === box2 && box2 === box3) {
            isWon = true;
            boxs[condition[0]].classList.add('win');
            boxs[condition[1]].classList.add('win');
            boxs[condition[2]].classList.add('win');
        }
    }

    if (isWon) {
        statusTxt.textContent = `${player} Won..`;
        running = false;
       /* alert(statusTxt.textContent);*/
    } else if (!options.includes("")) {
        statusTxt.textContent = `Game Draw...!`;
        running = false;
    } else {
        changePlayer();
    }
}

function handleAIMove() {
    let bestMove = minimax(options, 'O').index;
    updateBox(boxs[bestMove], bestMove);
    checkWinner();
    if (running) {
        isHumanTurn = true;
    }
}

function minimax(newBoard, player) {
    let availSpots = newBoard.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    if (checkWin(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    for (let i = 0; i < win.length; i++) {
        const condition = win[i];
        if (board[condition[0]] === player && board[condition[1]] === player && board[condition[2]] === player) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = x;
    running = true;
    player = "X";
    isHumanTurn = true;
    statusTxt.textContent = `${player} Your Turn`;

    boxs.forEach(box => {
        box.innerHTML = "";
        box.classList.remove('win');
    });
}
