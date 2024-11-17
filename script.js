// Game IIFE
const Game = (function () {
  // Private variables for board and players
  const rows = 3;
  const columns = 3;
  const board = [];
  const player1 = { name: "Player 1", marker: "X" };
  const player2 = { name: "Player 2", marker: "O" };
  let currentPlayer = player1;

  // Initialize the board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // Function to add a marker to the board
  const addMarker = (row, col) => {
    const cell = board[row][col];
    if (cell.getValue() === 0) {
      cell.addMarker(currentPlayer.marker);

      if (checkWinner()) {
        console.log(`Winner is: ${currentPlayer.name}`);
      } else if (checkTie()) {
        console.log(`No winner, tie game!`);
      } else {
        switchPlayer();
      }
      // This logs state of the board after each turn
      console.log(`Current Board State:`);
      board.forEach((row, i) =>
        console.log(row.map((cell) => cell.getValue()).join(" | "))
      );

      return true; // Marker added successfully
    }
    console.log("Cell is already occupied. Try a different move.");
    return false;
  };

  // Retrieve the value of a cell
  const getCellValue = (row, col) => board[row][col].getValue();

  // Reset the board for a new game
  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j] = Cell();
      }
    }
    currentPlayer = player1; // Reset to the first player
    console.log(
      "The game has been reset. The board is empty. Player 1 starts!"
    );
  };

  // Switch between players
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    console.log(`${currentPlayer.name} (${currentPlayer.marker})'s turn.`);
  };

  // Check for a winner
  const checkWinner = () => {
    const winningCombinations = [
      // Horizontal
      [getCellValue(0, 0), getCellValue(0, 1), getCellValue(0, 2)],
      [getCellValue(1, 0), getCellValue(1, 1), getCellValue(1, 2)],
      [getCellValue(2, 0), getCellValue(2, 1), getCellValue(2, 2)],
      // Vertical
      [getCellValue(0, 0), getCellValue(1, 0), getCellValue(2, 0)],
      [getCellValue(0, 1), getCellValue(1, 1), getCellValue(2, 1)],
      [getCellValue(0, 2), getCellValue(1, 2), getCellValue(2, 2)],
      // Diagonal
      [getCellValue(0, 0), getCellValue(1, 1), getCellValue(2, 2)],
      [getCellValue(0, 2), getCellValue(1, 1), getCellValue(2, 0)],
    ];

    for (const combination of winningCombinations) {
      if (
        combination[0] === combination[1] &&
        combination[0] === combination[2] &&
        combination[0] !== 0
      ) {
        return true; // Winning combination found
      }
    }

    return false; // No winner yet
  };

  // First version was nested for loop -> This is much cleaner
  // Board is 2d array, row is 1D array. For every row in a bard, for every cell in a row compare value
  const checkTie = () => {
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  // Expose public methods
  return { addMarker, getCellValue, resetBoard };
})();

// Cell Factory Function
function Cell() {
  let value = 0;

  const addMarker = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMarker,
    getValue,
  };
}

// EXPERIMENT

Game.addMarker(0, 0); // Player 1 places an 'X'
Game.addMarker(0, 1); // Player 2 places an 'O'
Game.addMarker(0, 2); // Player 1 places an 'X'
Game.addMarker(1, 0); // Player 2 places an 'O'
Game.addMarker(1, 1); // Player 1 places an 'X'
Game.addMarker(2, 0); // Player 2 places an 'O'
Game.addMarker(1, 2); // Player 1 places an 'X'
//Game.addMarker(2, 1); // Player 2 places an 'X'
//Game.addMarker(2, 2); // Player 2 places an 'O'

// If cell is skipped - for example marker is added in field j = 1 and j = 0 has a default value of 0
// Then marker is wrapped in a string, not X but 'X'

// SHOW BOARD IN CONSOLE ONCE MOVES ARE MADE

console.log(
  Game.getCellValue(0, 0),
  Game.getCellValue(0, 1),
  Game.getCellValue(0, 2)
);

console.log(
  Game.getCellValue(1, 0),
  Game.getCellValue(1, 1),
  Game.getCellValue(1, 2)
);

console.log(
  Game.getCellValue(2, 0),
  Game.getCellValue(2, 1),
  Game.getCellValue(2, 2)
);
