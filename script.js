const Player = () => {
    const getSign = () => "X";
    return { getSign }
};

const Computer = () => {
    const getSign = () => "O";
    return { getSign }
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    
    const setField = (index, sign) => {
        if (board[index] !== "") return;
        board[index] = sign;
        return board;
    }

    const getField = (index) => {
        return board[index];
    }

    const restart = () => {
        for (i = 0; i < board.length; i++) {
            board[i] = "";
        }
        return board;
    }

    return { setField, getField, restart }
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
            fields[i].textContent = gameBoard.getField(i);
        }
    }

    return { sendResultMessage, sendTurnMessage }
})();

const gameController = (() => {
    const playerX = Player();
    const playerO = Computer();
    let availableIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    let round = 1;
    let isOver = false;

    // combine playRound() and computerPlayRound() because 90% of them are similar 
    const playRound = (fieldIndex) => {
        if (fieldIndex == undefined) {
            fieldIndex = availableIndex[Math.floor((Math.random() * availableIndex.length))];
        }
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            displayController.sendResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round == 9) {
            displayController.sendResultMessage("Draw");
            isOver = true;
            return;
        }
        availableIndex.splice(availableIndex.indexOf(fieldIndex), 1);
        round++;
        displayController.sendTurnMessage(getCurrentPlayerSign());
    }

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const checkWinner = (fieldIndex) => {
        const winconditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        return winconditions
        .filter(combination => combination.includes(fieldIndex))
        .some(possibleCombination => possibleCombination.every(
            (index) => gameBoard.getField(index) == getCurrentPlayerSign())
        );
    }

    const getIsOver = () => { 
        return isOver;
    };

    const restart = () => {
        round = 1;
        isOver = false;
        availableIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }

    return { playRound, getCurrentPlayerSign, checkWinner, getIsOver, restart };
})();