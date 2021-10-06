'use strict'

var gBoard
var gClicksTotal;
var gFlagsTotal;
var gIsVictory;
var gStartTime;
var gDiff;
var gCurrRecord = Infinity;
var gInterval;
var gSafeClick;

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'



var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: '💖',
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function init() {
    //model
    gBoard = buildBoard()
    //dom
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gClicksTotal = 0
    gFlagsTotal = 0
    gIsVictory = false
    gSafeClick = 3;
    // gLevel.LIVES = '💖💖💖';
    document.querySelector('.flag span').innerText = gLevel.MINES;
    document.querySelector('h4').classList.add('hide');
    document.querySelector('.timer').innerText = `00:00:00`
    document.querySelector('.life span').innerText = gLevel.LIVES;
    document.querySelector('.restart span').innerText = '😁'
    document.querySelector('.SafeClick span').innerText = gSafeClick;


}



function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board;
}



function cellClicked(elCell, i, j, ev) {
    if (gGame.isOn) {
        if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
            return
        }
        gGame.shownCount++
        // console.log(gGame.shownCount);
        if (gGame.shownCount === 1 && gGame.markedCount === 0) {
            console.log('first click');
            randomBombs(gBoard, gLevel.SIZE, gLevel.MINES, i, j)
            setMinesNegsCount(gBoard)
            renderBoard(gBoard, '.board-container')
            startTimer()
        }
        gBoard[i][j].isShown = true
        renderBoard(gBoard, '.board-container')
        //the model td content will be empty, the dom td content is filled
        // console.log(elCell);
        gClicksTotal++

        if (gBoard[i][j].minesAroundCount === 0) {
            expandShown(gBoard, elCell, i, j)
        }

        if (gBoard[i][j].isMine) {
            if (gLevel.LIVES === '💖💖💖') {
                gLevel.LIVES = '💖💖'

                document.querySelector('.life span').innerText = gLevel.LIVES;
            } else if (gLevel.LIVES === '💖💖') {
                gLevel.LIVES = '💖'

                document.querySelector('.life span').innerText = gLevel.LIVES;
            } else if (gLevel.LIVES === '💖') {
                gLevel.LIVES = '';
                document.querySelector('.life span').innerText = gLevel.LIVES;
                gIsVictory = false
                loseGame()
            }

        } else if (gBoard[i][j].isMine) {
            gIsVictory = false
            loseGame()
        }
        // document.querySelector('.life span').innerText = gHearts;
        checkGameOver()
    }
}


function handleRightClick(elCell, i, j, ev) {
    if (gGame.isOn) {
        ev.preventDefault()

        cellMarked(elCell, i, j)
    }
}


function cellMarked(elCell, i, j) {

    if (gGame.shownCount === 0 && gGame.markedCount === 1) {

        gGame.markedCount++
        startTimer()
    }

    if (gFlagsTotal === gLevel.MINES && gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gFlagsTotal--
    }

    if (gFlagsTotal === gLevel.MINES) return
    if (gBoard[i][j].isShown) return
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gFlagsTotal++
    } else {
        gBoard[i][j].isMarked = false
        gFlagsTotal--
    }
    document.querySelector('.flag span').innerText = gLevel.MINES - gFlagsTotal;
    checkGameOver()
    // console.log('gFlagsTotal', gFlagsTotal);
    renderBoard(gBoard, '.board-container')
}



function restart() {
    if (gLevel.SIZE === 8) gLevel.LIVES = '💖💖';
    if (gLevel.SIZE === 12) gLevel.LIVES = '💖💖💖';
    if (gLevel.SIZE === 4) gLevel.LIVES = '💖';
    stopTimer()
    init()
}

function checkGameOver() {
    if (gFlagsTotal === gLevel.MINES && checkIfIsEmpty(gBoard)) {
        gIsVictory = true
        winGame()
    }
}

function winGame() {
    stopTimer()
    document.querySelector('h4').classList.remove('hide');
    document.querySelector('h4').innerText = 'You Win!';
    gGame.isOn = false
    document.querySelector('.restart span').innerText = '😎'
}

function loseGame() {
    revealAllBombs(gBoard)
    stopTimer()
    console.log('You lost');
    document.querySelector('h4').classList.remove('hide');
    document.querySelector('h4').innerText = 'You Lost!';
    gGame.isOn = false
    document.querySelector('.restart span').innerText = '😭'
    // document.querySelector('.restart').classList.remove('hide');
}



function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var countBombsNegs = countNeighbors(i, j, board)
            board[i][j].minesAroundCount = countBombsNegs
        }
    }
}


function changeLevel(elBtn) {
    restart()
    var level = elBtn.innerText
    if (level === 'Middle') {
        gLevel.SIZE = 8
        gLevel.MINES = 12
        gLevel.LIVES = '💖💖'
        document.querySelector('.life span').innerText = gLevel.LIVES;
    }
    if (level === 'Extreme') {
        gLevel.SIZE = 12
        gLevel.MINES = 30
        gLevel.LIVES = '💖💖💖'
        document.querySelector('.life span').innerText = gLevel.LIVES;
    }
    if (level === 'Easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gLevel.LIVES = '💖'
        document.querySelector('.life span').innerText = gLevel.LIVES;

    }
    init()
}


function renderBoard(mat, selector) {
    var strHTML = '<table border="8" cellpadding="11"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var elCell = mat[i][j];
            var cellContent = ''
            var className = `cell cell-${i}-${j}`
            if (elCell.isShown) {
                cellContent = elCell.minesAroundCount
                if (elCell.isMine === true) {
                    cellContent = '💣'
                    className += ' mine'
                } else if (elCell.minesAroundCount > 0) {
                    className += ' number'
                } else if (elCell.minesAroundCount === 0) {
                    cellContent = ''
                    className += ' empty'
                }
            }
            if (elCell.isMarked) cellContent = FLAG
            strHTML += `<td oncontextmenu="handleRightClick(this,${i},${j},event)" class="${className} "
             onclick="cellClicked(this,${i},${j},event)" 
             style="width:${100 / mat.length}px; height:${100 / mat.length}px; "> ${cellContent}   </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}




function showSafeCell() {
    if (!gGame.isOn) return
    if (gSafeClick === 0) return
    if (gGame.shownCount === 0 && gGame.markedCount === 0) return
    var i = getRandomInt(0, gLevel.SIZE)
    var j = getRandomInt(0, gLevel.SIZE)
    // for (var x = 0; x < gLevel.SIZE; x++) {
    //     if (gBoard[i][j].isShown && gBoard[i][j].isMine) {
    //         document.querySelector(`.cell-${i}-${j}`).classList.add('safeshow');
    //         setTimeout(function () { document.querySelector(`.cell-${i}-${j}`).classList.remove('safeshow'); }, 1500);
    //         gSafeClick--
    //     }

    // }
    // if(!gBoard[i][j].isShown && !gBoard[i][j].isMine) 
    //     for (var i = 0; i < gBoard.length; i++) {
    //         for (var j = 0; j < gBoard[i][j].length; j++) {
    //             if()  // gBoard[i][j].isShown  gBoard[i][j].isMarked 
    // while (!gBoard[i][j].isShown && !gBoard[i][j].isMine) {
    //      i = getRandomInt(0, gLevel.SIZE)
    //      j = getRandomInt(0, gLevel.SIZE)
    // }



    document.querySelector(`.cell-${i}-${j}`).classList.add('safeshow');
    setTimeout(function () { document.querySelector(`.cell-${i}-${j}`).classList.remove('safeshow'); }, 1500);
    gSafeClick--
    document.querySelector('.SafeClick span').innerText = gSafeClick;
    // var safeCell = gBoard[3][0]
    // cell.classList.add('.safeshow')

}