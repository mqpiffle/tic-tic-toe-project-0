console.log('js init')

// The JavaScript portion will be next
// Select elements and attach functions via event listeners
// You will also need a variable to keep track of moves. This will be used to indicate whether or not to draw an X or an O
/////////////////////////////////////////////////////////////////////////////
// Requirements
// A user should be able to click on different squares to make a move.
// Every click will alternate between marking an X and O
// Upon marking of an individual cell, use JavaScript to add an X or O to the cell, according to whose turn it is.
// A cell should not be able to be replayed once marked.
// You should not be able to click remaining empty cells after the game is over.
// Add a reset button that will clear the contents of the board.
// Display a message to indicate which turn is about to be played.
// Detect draw conditions (ties/cat's game)
// Detect winner: Stop game and declare the winner if one player ends up getting three in a row.
// Hint: Determine a set of winning combinations. Check those combinations on the board contents after every move.

///////////////////////////////////////////////////////
//!Global Varibales
// game on?
let gameOn = false
// setup players
const humanPlayer = {
    name: 'hooman',
    gamePiece: 'X',
    squaresChosen: [],
    score: 0
}
console.log(humanPlayer)

const robotPlayer = {
    name: 'mr roboto',
    gamePiece: 'O',
    squaresChosen: [],
    score: 0
}
console.log(robotPlayer)
// game board array
let turn = 0
// global who is the current player?
let currentPlayer
// console.log(currentPlayer)
let availableSquares= []
// all possible win conditions
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6] 
]
// check if a player won the game
let didSomebodyWin = false
let draw = false
//////////////////////////////////////////////////////////
//!Game Logic

const gameStart = () => {
    console.log('Game Started')
    gameOn = true
    initializeGame()
}

const startButton = () => {
    const buttonDisplay = document.getElementById('buttons-display')
    const startButton = document.createElement('button')
    startButton.className = 'button'
    startButton.id = 'start-button'
    startButton.innerText = 'Start New Game'
    buttonDisplay.appendChild(startButton)
    startButton.addEventListener('click', gameStart)
    const messages = document.getElementById('messages')
    messages.innerText = ''
}

startButton()

stageGame = () => {
    for (i = 0; i < 9; i++) {
        const square = document.getElementById(i)
        square.remove()
    }
    gameOn = false
    didSomebodyWin = false
    draw = false
    turn = 0
    humanPlayer.squaresChosen = []
    robotPlayer.squaresChosen = []
    availableSquares = []
    const element =  document.getElementById('continue-button')
    element.remove()
    const gameGrid = document.getElementById('game-grid')
    gameGrid.classList.remove('no-click')
    startButton()
}

const advanceTurn = () => {
    const messages = document.getElementById('messages')
    messages.innerText = `TURN: ${turn += 1}`
}

const continueButton = () => {
    const element =  document.getElementById('forfeit-button')
    element.remove()
    const buttonDisplay = document.getElementById('buttons-display')
    const continueButton = document.createElement('button')
    continueButton.className = 'button'
    continueButton.id = 'continue-button'
    continueButton.innerText = 'Continue...'
    buttonDisplay.appendChild(continueButton)
    continueButton.addEventListener('click', stageGame)
}

const battleDraw = () => {
    const messages = document.getElementById('messages')
    messages.innerText = `It's a DRAW!!`
    continueButton()
}

const battleWinner = () => {
    currentPlayer.score++
    const messages = document.getElementById('messages')
    messages.innerText = `${currentPlayer.name} is the WINNER!!`
    continueButton()
}

const lockBoard = () => {
    const gameGrid = document.getElementById('game-grid')
    gameGrid.className = 'no-click'
}

const checkForWin = (player) => {
    for (const entry of winConditions) {
        if (entry.every(element => player.squaresChosen.includes(element)) === true) {
            didSomebodyWin = true
            lockBoard()
            battleWinner()
        }
    }
    if (turn === 8 && !didSomebodyWin) {
        lockBoard()
        battleDraw()
    } else if (turn < 8 && !didSomebodyWin) {
        if (player === humanPlayer) {
            advanceTurn()
            currentPlayer = robotPlayer
            robotSquareChoice()
        } else {
            advanceTurn()
            currentPlayer = humanPlayer
            humanSquareChoice()
        }
    }
}

const addSquaresToPlayerArray = (player, value) => {
    player.squaresChosen.push(value)
    player.squaresChosen.sort()
}

const markSquare = (targetSquare, player) => {
    targetSquare.innerText = player.gamePiece
    targetSquare.classList.add('no-click')
}

const squareClickHandler = (event) => {
    // console.log(`event.target.id = ${event.target.id} and the type is ${typeof event.target.id}`)
    //get id of clicked square
    const idToNum = +event.target.id
    const chosenSquare = document.getElementById(event.target.id)
    const indexToDelete = availableSquares.indexOf(idToNum)
    // console.log(`human player chooses tile ${event.target.id} and the index is ${indexToDelete}`)
    markSquare(chosenSquare, humanPlayer)
    //remove square from available squares
    addSquaresToPlayerArray(humanPlayer, idToNum)
    availableSquares.splice(indexToDelete, 1)
    // console.log(`player's chosen squares are ${humanPlayer.squaresChosen} and the type is ${typeof humanPlayer.squaresChosen[0]}`)
    console.log(humanPlayer)
    checkForWin(humanPlayer)
}

const humanSquareChoice = () => {
    // console.log(`current player is ${currentPlayer.name}`)
    //listen for click event on empty square (returns array - node list)
    const gameSquare = document.querySelectorAll('.game-square')
    //add click listener to every square in the array
    for (let i=0; i<gameSquare.length; i++) {
        gameSquare[i].addEventListener('click', squareClickHandler)
    }   
}

const robotSquareChoice = () => {
    // console.log(`current player is ${currentPlayer.name}`)
    //randomly pick and empty square
    const randomPick = Math.floor(Math.random() * availableSquares.length)
    // console.log(`robot rolls a ${randomPick}`)
    const chosenSquare = document.getElementById(`${availableSquares[randomPick]}`)
    const indexToDelete = randomPick
    markSquare(chosenSquare, robotPlayer)
    // console.log(`robot player chooses tile ${availableSquares[randomPick]}`)

    addSquaresToPlayerArray(robotPlayer, availableSquares[randomPick])
    availableSquares.splice(indexToDelete, 1)
    // console.log(`availableSquares array = ${availableSquares}`)
    console.log(robotPlayer)
    checkForWin(robotPlayer)
    // currentPlayer =  humanPlayer
    // playerSquareChoice()
}

const chooseFirstPlayer = () => {
    //choose first player randomly
    const diceRoll = Math.floor(Math.random() * 2)
    if (diceRoll === 0) {
        currentPlayer = humanPlayer
        humanSquareChoice()
    } else {
        currentPlayer = robotPlayer
        robotSquareChoice()
    }
}

const forfeitGameButton = () => {
    const buttonDisplay = document.getElementById('buttons-display')
    const forfeitButton = document.createElement('button')
    forfeitButton.className = 'button'
    forfeitButton.id = 'forfeit-button'
    forfeitButton.innerText = 'Forfeit Game'
    buttonDisplay.appendChild(forfeitButton)
    forfeitButton.addEventListener('click', stageGame)
}

const createGameBoard = () => {
    forfeitGameButton()
    //create divs with for loop
    for (let i=0; i<9; i++) {
        //populate emptySquares array
        availableSquares.push(i)
        const gameGrid = document.getElementById('game-grid')
        //create game squares
        const gameSquare = document.createElement('div')
        //give squares class of "game-square"
        gameSquare.className = 'game-square'
        //give squares id of `square${gameBoard[i]}`
        gameSquare.id = `${i}`
        gameSquare.innerText = ' '
        //add squares to DOM
        gameGrid.appendChild(gameSquare)
    }
}

const initializeGame = () => {
    const element =  document.getElementById('start-button')
    element.remove()
    createGameBoard()
    chooseFirstPlayer()
}
