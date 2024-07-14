document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset");
    const playerXButton = document.getElementById("playerX");
    const playerOButton = document.getElementById("playerO");
    const winnerMessage = document.getElementById("winner");
    const difficultySelect = document.getElementById("difficulty");

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameover = false;
    let difficulty = "easy"; // Default difficulty

    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWin = (currentBoard) => {
        for (let combo of winCombos) {
            const [a, b, c] = combo;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        return null;
    };

    const checkDraw = (currentBoard) => {
        return currentBoard.every(cell => cell !== "");
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
        cells[index].innerText = currentPlayer;
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnButtons();
    };

    const updateTurnButtons = () => {
        if (currentPlayer === "X") {
            playerXButton.classList.add("active");
            playerOButton.classList.remove("active");
        } else {
            playerOButton.classList.add("active");
            playerXButton.classList.remove("active");
        }
    };

    const resetGame = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameover = false;
        winnerMessage.innerText = "";
        updateTurnButtons();
        cells.forEach(cell => {
            cell.innerText = "";
            cell.style.backgroundColor = "#ddd";
        });
    };

    const handleClick = (e) => {
        const index = parseInt(e.target.id.split("-")[1]);
        if (board[index] || gameover) return;
        
        updateBoard(index);
        const winner = checkWin(board);
        if (winner) {
            winnerMessage.innerText = `${winner} wins!`;
            gameover = true;
        } else if (checkDraw(board)) {
            winnerMessage.innerText = "It's a draw!";
            gameover = true;
        } else {
            switchPlayer();
            if (currentPlayer === "O" && difficulty === "hard") {
                makeMoveAI();
            }
        }
    };

    const makeMoveAI = () => {
        // Simple AI move for "hard" difficulty (random move)
        let emptyCells = board.reduce((acc, curr, index) => {
            if (curr === "") acc.push(index);
            return acc;
        }, []);
        
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        updateBoard(emptyCells[randomIndex]);
        const winner = checkWin(board);
        if (winner) {
            winnerMessage.innerText = `${winner} wins!`;
            gameover = true;
        } else if (checkDraw(board)) {
            winnerMessage.innerText = "It's a draw!";
            gameover = true;
        } else {
            switchPlayer();
        }
    };

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    resetButton.addEventListener("click", resetGame);

    difficultySelect.addEventListener("change", () => {
        difficulty = difficultySelect.value;
        resetGame();
    });

    // Initial setup
    updateTurnButtons();
});

