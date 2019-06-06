/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++){
    board.push([]);
    for (let j = 0; j < WIDTH; j++){
      board[i].push(null);
    }
  }
  //console.log(board);
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //get "board" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board")
  //creates top row with click listener to add to htmlBoard
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    
    let indicator = document.createElement("div");
    indicator.className = "top-cell"
    headCell.append(indicator)

    top.append(headCell);
  }
  htmlBoard.append(top);

  //creates other rows
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  
  for (let i = 0; i < board.length; i++) {
    let y = board.length - i - 1

    if (board[y][x] === null) {
      return y
    }
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  console.log("x and y", x, y)
  let piece = document.createElement("div") 
  piece.className = `piece p${currPlayer}`

  let location = document.getElementById(`${y}-${x}`)

  //console.log(location)
  location.append(piece)
  
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(function(){alert(msg);},100)
  setTimeout(resetGame, 2000)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  console.log("clicked")
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (checkForTie()){
    return endGame("It's a tie!");
  }

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // switch players
  // switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
        ([y, x]) =>
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            board[y][x] === currPlayer
    );
  }

  //makes arrays of all possible rows of four, and calls _win to see
  // if there is a win in any of them. 

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function checkForTie(){
  for (let i = 0; i < board.length; i++){
    for (let j = 0; j < board[i].length;j++){
      if (board[i][j]===null){
        return false;
      }
    }
  }
  return true;
}

function resetGame() {
  board = []
  let htmlBoard = document.getElementById("board")

  htmlBoard.innerHTML = ""
  makeBoard();
  makeHtmlBoard();
}

resetGame()
