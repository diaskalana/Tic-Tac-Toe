function Gameboard() {

    const board = [[null, null, null], [null, null, null], [null, null, null]];

    function addResponse(x, y, marker) {
        if (board[x - 1][y - 1] === null) {
            board[x - 1][y - 1] = marker;
        }
        // console.log(board)
        markCells();
    }

    function markCells() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let currentCell = document.querySelector(`div[row="${i + 1}"][column="${j + 1}"]`)
                if (board[i][j] !== null) {
                    // console.log(board[i][j]);
                    currentCell.textContent = board[i][j];
                    currentCell.classList.add('checked');
                } else {
                    currentCell.textContent = '';
                    currentCell.classList.remove('checked');
                }
            }
        }

    }

    function freezeCells() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                document.querySelector(`div[row="${i + 1}"][column="${j + 1}"]`).classList.add('checked')
            }
        }
    }

    function resetCells() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = null
            }
        }
        markCells();

    }

    return { addResponse, markCells, resetCells, freezeCells, board };
}

function Player(marker) {

    const playerMarker = marker

    function getMarker() {
        return playerMarker
    }

    return { getMarker }
}

function gameController(player1, player2, board) {

    let currentPlayer = player1;

    function switchPlayerTurn() {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }

    function clickResponse() {
        return currentPlayer.getMarker()
    }

    function turnMessage() {
        if (currentPlayer == player1) {
            return "Player1 Turn"
        } else if (currentPlayer == player2) {
            return "Player2 Turn"
        }
    }
    function checkWinner() {
        let winner = winnerMarker()
        if (winner != 0) {
            if (winner == 'x') {
                return 'Player1 Wins!'
            } else if (winner == 'o') {
                return 'Player2 Wins!'
            } else {
                return "It's a draw!"
            }

        } else {
            return false
        }
    }

    function winnerMarker() {
        for (let i = 0; i < board.length; i++) {

            if ((board[i][0] == board[i][1]) && (board[i][1] == board[i][2]) && (board[i][2] !== null)) {
                return board[i][2]
            }
        }

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if ((board[0][j] == board[1][j]) && (board[1][j] == board[2][j]) && (board[2][j] !== null)) {
                    return board[2][j]
                }
            }
        }
        if ((board[0][0] == board[1][1]) && (board[1][1] == board[2][2]) && (board[2][2] !== null)) {
            return board[2][2]
        } else if ((board[0][2] == board[1][1]) && (board[1][1] == board[2][0]) && (board[2][0] !== null)) {
            return board[2][0]
        }

        const newArr = [];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                newArr.push(board[i][j])
            }
        }
        if (!newArr.includes(null)) {
            return 'draw'
        }

        return 0;

    }


    return { clickResponse, switchPlayerTurn, turnMessage, checkWinner }
}

const gameBoard = document.querySelector('.gameBoard')
const message = document.querySelector('.gameContainer > p')
const resetBtn = document.querySelector('.resetBtn')

const gameboard = Gameboard();

const player1 = Player('x');
const player2 = Player('o');

const gameControl = gameController(player1, player2, gameboard.board);

message.textContent = gameControl.turnMessage()
gameBoard.addEventListener('click', (e) => {
    if (e.target.classList.contains('cell')) {

        if (!e.target.classList.contains('checked')) {
            const x = e.target.getAttribute('row');
            const y = e.target.getAttribute('column');
            gameboard.addResponse(x, y, gameControl.clickResponse());
            gameControl.switchPlayerTurn()
            message.textContent = gameControl.turnMessage()
            if (gameControl.checkWinner()) {
                message.textContent = gameControl.checkWinner()
                gameboard.freezeCells()
                resetBtn.style.visibility = 'visible'
            }
        }
    }
})

resetBtn.addEventListener('click', () => {
    gameboard.resetCells()
    resetBtn.style.visibility = 'hidden'
    gameControl.switchPlayerTurn()
    message.textContent = gameControl.turnMessage()
})