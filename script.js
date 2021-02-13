// @param: sign => pass in 'X' or 'O' when create player 

const Player = (sign) => {
    const getSign = () => sign;
    return { getSign }
}

// control gameBoard both in html and js 
// js: a board with 9 empty strings, indexes 0 -> 8
// --- when user clicks, fill the appropriate index with player's sign
// html: just text
// convert the board array to front-end board
// by taking the content of appropriate index and output on the screen 
// reset: by going through each of the indexes and empty with "" 

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    // get input from html to the backend board 
    // @param index: get index of the field 
    // @param sign: get sign of user's input to pass in field 
    const setField = (index, sign) => {
        board[index] = sign;
        return board;
    }

    // print output on the screen (on html)
    // @param index: get the sign given index 
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
            gameController.playRound(parseInt(field.dataset.index));
        })
    )

    restartButton.addEventListener('click', () => { console.log(gameBoard.restart()) });

    const sendResultMessage = (sign) => {
        if (sign == "X" || sign == "O") {
            message.textContent = `Player ${sign} is the winner!`;
        } else if (sign == "Draw") {
            message.textContent = `It's a Draw!`;
        }
    }

    return { sendResultMessage }
})();

const gameController = (() => {
    const playerX = Player('X');
    const playerO = Player('O');
    let round = 1;
    let isOver = false;

    const playRound = (fieldIndex) => {
        console.log(gameBoard.setField(fieldIndex, getCurrentPlayerSign()));
        if (checkWinner(fieldIndex)) {
            displayController.sendResultMessage(getCurrentPlayerSign());
        } else if (round == 9) {
            displayController.sendResultMessage("Draw");
        }
        round++;
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

    return { playRound, getCurrentPlayerSign, checkWinner }
})();

// controller includes fields, message (whose turn), and restart button 
// each of these changes throughout the game, so we have to modify them throughout 

// fields: 
// --- what happens when click? that's one round
// --- --- what happens when it's one round already? check if win/draw/nothing happens and continues 
// --- --- --- display on board either win/draw/continues through messages or through board fields 
// --- --- --- else: restart when done
// game board updates without returning the functions 
// only messages and results should be displayed and returned to be used in other factory functions 

///---///

// before a game starts: 
// 1. 2 players ('X' and 'O')
// 2. start round at 1 
// 3. game is not over 

// while the game is going on: 
// --- check what round it is and what happens that round: 
// --- --- someone wins? by checking the win conditions 
// --- --- --- => if true then display message result and game is over 
// --- --- all fields are filled? 
// --- --- --- => if true then display draw and game is over 
// --- --- else? 
// --- --- --- => update round (round++) & update message (whose turn)

/*
const Player = (sign) => {
    this.sign = sign;
    const getSign = () => {
        return sign;
    };
    return { getSign }
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    // set field to keep track of which index is filled with which sign
    const setField = (index, sign) => {
        // if you can only choose from the board, why need this condition check?
        if (index > board.length) return;
        board[index] = sign; // set the board index to sign, so it can be ["X", "", "O", "", "O", "", "", "", ""]
    }

    // get field to pass 'X' or 'O' out to the html board
    const getField = (index) => {
        if (index > board.length) return;
        return board[index]; // print 'X' or 'O'
    }

    // reset everything by changing 'X' or 'O' to '' (empty string)
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }
    return { setField, getField, reset }
})();

const displayController = (() => {
    const fieldElements = document.querySelectorAll('.field'); // get all the fields into one NodeList
    const messageElement = document.getElementById('message'); // get the message "Player X/O's turn" => change accordingly 
    const restartButton = document.getElementById('restart-button'); // restart the game

    // interact with the players 
    fieldElements.forEach((field) => 
    // set event when clicked 
        field.addEventListener('click', (e) => {
            // check conditions when game is already over or when field is already filled with 'X' or 'O'
            // if that's true => nothings happens | returns 
            if (gameController.getIsOver() || e.target.textContent !== '') return;
            // if condition passed: 
            // that's one playround -> so check if win (win/draw) or update round
            gameController.playRound(parseInt(e.target.dataset.index)); // get the chosen field's data-index
            // add 'X' or 'O' to the board
            updateGameboard();
        })
    );

    restartButton.addEventListener('click', (e) => {
        // board array = ["", "", "", "", "", "", "", "", ""]
        gameBoard.reset();
        // round = 1; isOver = true;
        gameController.reset();
        // gameboard empty
        updateGameboard();
        // player X always plays first
        setMessageElement("Player X's turn");
    });

    const updateGameboard = () => {
        // update whole board => time efficiency? 
        for (let i = 0; i < fieldElements.length; i++) {
            fieldElements[i].textContent = gameBoard.getField(i);
        }
    };

    const setResultMessage = (winner) => {
        if (winner === 'Draw') {
            setMessageElement("It's a draw!");
        } else {
            setMessageElement(`Player ${winner} has won!`);
        }
    };

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    }

    return {
        // an object
        setResultMessage,
        setMessageElement
    };
})();

const gameController = (() => {
    const playerX = Player('X');
    const playerO = Player('O');
    let round = 1; // default = start with round 1 
    let isOver = false; // game is going, not over :) 

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            // if pass winConditions 
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        } else if (round === 9) {
            // if finishes 9 rounds but nothing happens 
            displayController.setResultMessage("Draw");
            isOver = true;
            return;
        } // else: 
        round++;
        displayController.setMessageElement(
            `Player ${getCurrentPlayerSign()}'s turn`
        );
    };

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const checkWinner = (fieldIndex) => {
        const winConditions = [
            // check if win with rows 
            [0, 1, 2], 
            [3, 4, 5],
            [6, 7, 8],
            // check if win with columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // check if win with diagons
            [0, 4, 8],
            [2, 4, 6],
        ];
        
        // .some( (element) => { // callback } ): at least one element in the array passes the test function
        // .every( (element) => { // callback } ): all elements pass the test function 
        return winConditions // => returns true/false 
            // goes through each combination
            // see if that combination (eg: [0, 1, 2]) includes the fieldIndex
            .filter( (combination) => combination.includes(fieldIndex) )
            // see if there's at least one possible combination
            // in which each of the indexes has sign that matches that of current player's
            .some( (possibleCombination) => possibleCombination
                .every( (index) => gameBoard.getField(index) === getCurrentPlayerSign())
        );
    };

    const getIsOver = () => {
        return isOver;
    }

    const reset = () => {
        round = 1;
        isOver = false;
    };

    return {
        playRound, 
        getIsOver,
        reset
    }
})();

*/