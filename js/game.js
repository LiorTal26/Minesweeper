'use strict'

var gBoard = {
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed:0

}

const MINE = '💣';
const EMPTY = '';


function initGame() {
    console.log('hello')
    gBoard = buildBoard()
    // createPacman(gBoard);
    // createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    gGame.isOn = true
    console.table(gBoard)
}


function buildBoard() {
    var SIZE = 4;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = EMPTY;

            // if (i === 0 || i === SIZE - 1 ||
            //     j === 0 || j === SIZE - 1 ||
            //     (j === 3 && i > 4 && i < SIZE - 2)) {
            //     board[i][j] = WALL;
            // }
        }
    }
    board[1][1] = MINE;
    board[2][3] = MINE;
    

    return board;
}





