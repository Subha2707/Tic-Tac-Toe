let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector(".reset-btn");
let newgameBtn = document.querySelector(".new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let human = "O";
let computer = "X";
let gameOver = false;
let count = 0;

// ✅ IMPORTANT: separate board
let board = ["", "", "", "", "", "", "", "", ""];

const winPattern = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

const resetGame = () => {
    gameOver = false;
    count = 0;
    board = ["", "", "", "", "", "", "", "", ""];
    enableBoxes();
    msgContainer.classList.add("hide");
};

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (board[index] !== "" || gameOver) return;

        // Human move
        makeMove(index, human);

        if (checkWinner(board, human)) return;

        if (count === 9) {
            gameDraw();
            return;
        }

        setTimeout(computerMove, 400);
    });
});

const makeMove = (index, player) => {
    board[index] = player;
    boxes[index].innerText = player;
    boxes[index].disabled = true;
    count++;
};

const computerMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = computer;
            let score = minimax(board, 0, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    makeMove(move, computer);
    checkWinner(board, computer);
};

// ✅ Proper Minimax (NO DOM here)
const minimax = (board, depth, isMaximizing) => {
    let result = evaluate(board);
    if (result !== null) return result;

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = computer;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = human;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
};

// ✅ Evaluate board state
const evaluate = (board) => {
    for (let pattern of winPattern) {
        let [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            if (board[a] === computer) return 10;
            if (board[a] === human) return -10;
        }
    }

    if (!board.includes("")) return 0; // draw

    return null;
};

const checkWinner = (board, player) => {
    for (let pattern of winPattern) {
        let [a,b,c] = pattern;

        if (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        ) {
            showWinner(player);
            return true;
        }
    }
    return false;
};

const gameDraw = () => {
    msg.innerText = "Game was a Draw 🤝";
    msgContainer.classList.remove("hide");
    gameOver = true;
};

const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

const showWinner = (winner) => {
    msg.innerText = winner === human 
        ? "🎉 You Win!" 
        : "🤖 Computer Wins!";
    msgContainer.classList.remove("hide");
    gameOver = true;
    disableBoxes();
};

resetBtn.addEventListener("click", resetGame);
newgameBtn.addEventListener("click", resetGame);