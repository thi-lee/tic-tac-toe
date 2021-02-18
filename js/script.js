// https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/

const Player = (sign) => {
    const getSign = () => sign;
    return { getSign }
};

const gameBoard = (() => {
    let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    let getBoard = () => board;
    
    const setField = (index, sign) => {
        if (board[index] == "X" && board[index] == "O") return;
        board[index] = sign;
        return board;
    }

    const getField = (index) => {
        return board[index];
    }

    const emptyIndexes = (newBoard) => {
        emptyI = newBoard.filter(index => index != "X" && index != "O");
        return emptyI;
    }

    const restart = () => {
        for (i = 0; i < board.length; i++) {
            board[i] = i;
        }
        return board;
    }

    return { getBoard, setField, getField, emptyIndexes, restart }
})();

const displayController = (() => {
    const fields = document.querySelectorAll('.field');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');

    fields.forEach((field) => 
        field.addEventListener('click', () => {
            if (gameController.getIsOver() == true || field.textContent !== '') return;
            gameController.playRound(parseInt(field.dataset.index));
            updateGameboard();
            setTimeout(() => {
                if (gameController.getIsOver() == true) return;
                gameController.playRound();
                updateGameboard();
            }, 1000)
        })
    )

    restartButton.addEventListener('click', () => { 
        gameBoard.restart();
        gameController.restart();
        updateGameboard();
        message.textContent = `Player X's turn.`;
    });

    const sendResultMessage = (sign) => {
        if (sign == "X" || sign == "O") {
            message.textContent = `Player ${sign} is the winner!`;
        } else if (sign == "Draw") {
            message.textContent = `It's a Draw!`;
        }
    }

    const sendTurnMessage = (sign) => {
        message.textContent = `Player ${sign}'s turn.`
    }

    const updateGameboard = () => {
        for (i = 0; i < fields.length; i++) {
            if (gameBoard.getField(i) !== "X" && gameBoard.getField(i) !== "O") {
                fields[i].textContent = "";
            } else {
                fields[i].textContent = gameBoard.getField(i);
            }
        }
    }

    return { sendResultMessage, sendTurnMessage }
})();

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = (fieldIndex) => {
        if (fieldIndex == undefined) {
            console.log('hello');
            fieldIndex = minimax(gameBoard.getBoard(), getCurrentPlayerSign()).index;
        }
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (winning(gameBoard.getBoard(), getCurrentPlayerSign())) {
            displayController.sendResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round == 9) {
            displayController.sendResultMessage("Draw");
            isOver = true;
            return;
        }
        round++;
        displayController.sendTurnMessage(getCurrentPlayerSign());
    }

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const winning = (board, player) => {
        if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
        ) {
            return true;
        } else {
            return false;
        }
    }

    // newBoard = gameBoard.getBoard() => e.g. [0, 1, 2, 3, 4, 5, 6, 7, 8]
    // player = getCurrentPlayerSign()
    const minimax = (newBoard, player) => {
        const availSpots = gameBoard.emptyIndexes(newBoard);

        // only score: 0 runs
        if (winning(newBoard, "X")) {
            return { score: -10 };
        } else if (winning(newBoard, "O")) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        // an array to collect all the objects
        let moves = [];

        // loop through available spots
        for (let i = 0; i < availSpots.length; i++) {
            // create an object for each and store the index of that spot 
            let move = {};
            move.index = newBoard[availSpots[i]];  // right now it's newBoard[""];

            // set the empty spot to the current player
            newBoard[availSpots[i]] = player;

            /* collect the score resulted from calling minimax
               on the opponent of the current player */
            if (player == playerO.getSign()) {
                let result = minimax(newBoard, playerX.getSign());
                move.score = result.score;
            } else {
                let result = minimax(newBoard, playerO.getSign());
                move.score = result.score;
            }

            // reset the spot to empty 
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        // if it is the computer's turn loop over the moves and choose the move with the highest score
        let bestMove;
        if (player === playerO.getSign()) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            // else loop over the moves and choose the move with the lowest score
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        // return the chosen move (object) from the moves array
        return moves[bestMove];
    }

    const getIsOver = () => { 
        return isOver;
    };

    const restart = () => {
        round = 1;
        isOver = false;
    }

    return { playRound, getCurrentPlayerSign, getIsOver, restart };
})();