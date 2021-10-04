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
    gBoard = createBoard()
    // createPacman(gBoard);
    // createGhosts(gBoard);
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
    console.table(gBoard)
}




function createBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = gBoard
            // board[i][j] = cell;
        }
    }
    board[1][1] = MINE;
    board[2][3] = MINE;
    return board;
}

// render the board in table
// add class 'occupied'
function renderBoard(board) {
    // console.table(board);
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = (cell) ? 'occupied' : '';
            strHtml += `<td class="${className}"
            data-i="${i}" data-j="${j}"
            onclick="cellClicked(this,${i},${j})"
            > ${cell} </td>`;
        }
        strHtml += '</tr>'
    }
    // console.log('strHtml', strHtml)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;

}

// click on a TD with LIFE upgrade to SUPER_LIFE and never dies
// function cellClicked(elCell, cellI, cellJ) {
//     // console.dir(elCell)
//     // if(elCell.classList.contains('occupied'))
//     // if(elCell.innerText === LIFE)
//     if (gBoard[cellI][cellJ] === LIFE) {
//         // update the model:
//         gBoard[cellI][cellJ] = SUPER_LIFE;
//         // update the dom:
//         elCell.innerText = SUPER_LIFE;
//         blowUpNegs(cellI, cellJ, gBoard)
//     }
// }


// function cellClicked(elCell, i, j) { 
//     var cell = gCinema[i][j]
//     console.log('Cell clicked: ', i, j, cell);
//         // TODO: ignore none seats and booked
//     if (cell.type !== 'SEAT') return

//     if (gElSelectedSeat) {
//         gElSelectedSeat.classList.remove('selected')
//     }

//     if (gElSelectedSeat === elCell) {
//         gElSelectedSeat = null;
//     } else {
//         gElSelectedSeat = elCell;
//         gElSelectedSeat.classList.add('selected')
//     }

//     if (gElSelectedSeat) showSeatDetails({i:i, j:j})
//     else hideSeatDetails()

// }


