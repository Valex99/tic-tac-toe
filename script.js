// Game IIFE
const Game = (function () {
  // Private variables for board and players
  const rows = 3;
  const columns = 3;
  const board = [];
  let player1 = null; // Will be assigned dynamically
  let player2 = null;
  let currentPlayer = null;

  let gameMode = "PvC"; // Default game mode is Player vs Computer

  // Initialize the game with the selected marker
  const initializeGame = (humanMarker) => {
    //const computerMarker = humanMarker === "X" ? "O" : "X";
    //console.log(computerMarker);

    if (gameMode === "PvC") {
      player1 =
        humanMarker === "X"
          ? { name: "Human", marker: "X" }
          : { name: "Computer", marker: "X" };
      console.log(player1);

      player2 =
        humanMarker === "O"
          ? { name: "Human", marker: "O" }
          : { name: "Computer", marker: "O" };

      console.log(player2);
    } else if (gameMode === "PvP") {
      player1 = { name: "Player1", marker: "X" };
      player2 = { name: "Player2", marker: "O" };
    }

    // Player 1 always starts
    // Player 1 is always X (computer or human)
    currentPlayer = player1;

    // Initialize the board with Cell objects
    for (let i = 0; i < rows; i++) {
      board[i] = []; // Create a sub-array for each row
      for (let j = 0; j < columns; j++) {
        board[i][j] = Cell(); // Add a Cell object to each position
      }
    }
    console.log(
      `Game initialized. ${currentPlayer.name} (${currentPlayer.marker}) starts!`
    );
    // After board has been initialized, check if it's computer's turn
    if (currentPlayer.name === "Computer") {
      triggerComputerMove();
    }
  };

  // Expose getter methods for rows and columns (to be used by code outside Game module)
  const getRows = () => rows;
  const getColumns = () => columns;

  // It really is that simple - just add and remove class
  const triggerComputerMove = () => {
    UI.disableGrid(); // Disable grid during computer's turn
    setTimeout(() => {
      let computerMarker = currentPlayer.marker;
      console.log(`Computer marker is: ${computerMarker}`);
      computerMove();
      UI.enableGrid(); // Re-enable grid after computer's move
    }, 800); // 0.7 second delay
    // This function should call UI to add computer marker
  };

  const computerMove = () => {
    let row, col;
    do {
      row = Math.floor(Math.random() * rows);
      col = Math.floor(Math.random() * columns);
      // Call get value method ax X, Y to check if the cell is empty
    } while (board[row][col].getValue() !== 0);

    console.log(`Computer placed marker at ${row}, ${col}`);
    addMarker(row, col);
  };

  // Function to add a marker to the board
  const addMarker = (row, col) => {
    const cell = board[row][col];
    if (cell.getValue() === 0) {
      cell.addMarker(currentPlayer.marker);
      // As soon as the marker is added -> notify UI about updated cell
      UI.updateCell(row, col, currentPlayer.marker);

      const winner = checkWinner();
      if (winner) {
        UI.gameOver(winner); // Pass the winner's name to the UI - as you call it, pass it an argument
        console.log(`Winner is: ${currentPlayer.name}`);
      } else if (checkTie()) {
        UI.gameOver("Tie");
        console.log(`No winner, tie game!`);
      } else {
        switchPlayer();
        if (currentPlayer.name === "Computer") {
          triggerComputerMove();
        }
      }
      return true; // Marker added successfully
    }
    console.log("Cell is already occupied. Try a different move.");
    return false;
  };

  // Retrieve the value of a cell
  const getCellValue = (row, col) => board[row][col].getValue();

  // Reset the board for a new game
  // This only clears the logic, clear the UI in UI module
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

    // If computer is on the move
    if (currentPlayer.name === "Computer") {
      console.log("YES");
    }
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
        return currentPlayer.name; // Winning combination found
      }
    }
    return null; // No winner yet
  };

  // First version was nested for loop -> This is much cleaner
  // Board is 2d array, row is 1D array. For every row in a bard, for every cell in a row compare value
  const checkTie = () => {
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  // Expose public methods
  return {
    initializeGame,
    addMarker,
    getCellValue,
    resetBoard,
    getRows,
    getColumns,
    //
  };
})();

// Cell Factory Function - encapsulated private function
// Cell function should not interact with the DOM
function Cell() {
  let value = 0;

  // This function is responsible for writing a specific value to cell (X or O)
  const addMarker = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMarker,
    getValue,
  };
}

const UI = (function () {
  const markerButton = document.querySelectorAll(".marker-button");
  const chooseMarkerDiv = document.querySelector(".select-marker-div");
  const gameboardDiv = document.querySelector(".gameboard-div");
  //
  const playerPlayer = document.querySelector(".PvP-div");
  const PlayerComputer = document.querySelector(".PvC-div");
  // Game over
  const backdrop = document.querySelector(".outcome");
  const outcomeText = document.querySelector(".outcome-text");
  const logo = document.querySelector(".logo");

  const grid = () => {
    // Pass rows and columns from Game module to UI module
    const rows = Game.getRows();
    const columns = Game.getColumns();
    gameboardDiv.innerHTML = "";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", i);
        cell.setAttribute("data-col", j);
        gameboardDiv.appendChild(cell);
        // Add event listener to each cell
        // e.target is used to retrieve custom data attributes (data-row and data-col) from an HTML element that triggered an event.
        // e.target refers to the DOM element that triggered the event
        cell.addEventListener("click", (e) => {
          const row = parseInt(e.target.getAttribute("data-row"));
          const col = parseInt(e.target.getAttribute("data-col"));

          console.log(`Clicked cell at row: ${row}, col: ${col}`);

          // Now add marker function neds to be called
          const success = Game.addMarker(row, col);

          if (success) {
            const currentPlayerMarker = Game.getCellValue(row, col); // Place the marker
            e.target.textContent = currentPlayerMarker; // Update the cell's text
            e.target.style.cursor = "not-allowed";
          }
        });
      }
    }
  };

  const disableGrid = () => {
    gameboardDiv.classList.add("disabled");
  };

  const enableGrid = () => {
    gameboardDiv.classList.remove("disabled");
  };

  const updateCell = (row, col, marker) => {
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) {
      cell.textContent = marker; // Update the cell's text content
      cell.style.cursor = "not-allowed";
    }
  };

  markerButton.forEach((element) => {
    element.addEventListener("click", () => {
      chooseMarkerDiv.style.display = "none";
      gameboardDiv.style.display = "grid";
      playerPlayer.style.display = "flex";
    });
  });

  playerPlayer.addEventListener("click", () => {
    PlayerComputer.style.display = "flex";
    playerPlayer.style.display = "none";
    // When this icon is clicked
    // Clear board
    // Switch game mode to PVP
  });

  PlayerComputer.addEventListener("click", () => {
    PlayerComputer.style.display = "none";
    playerPlayer.style.display = "flex";
  });

  // Which marker player selected
  let selectedMarker;

  const xButton = document.querySelector(".x");
  const oButton = document.querySelector(".o");
  //
  xButton.addEventListener("click", () => {
    selectedMarker = "X";
    console.log("SELECTED MARKER:", selectedMarker);
    Game.initializeGame(selectedMarker);
  });

  oButton.addEventListener("click", () => {
    selectedMarker = "O";
    console.log("SELECTED MARKER:", selectedMarker);
    Game.initializeGame(selectedMarker);
  });

  const gameOver = (winner) => {
    backdrop.style.display = "flex";
    logo.style.filter = "invert(30%)";

    if (winner === "Tie") {
      outcomeText.textContent = "Tie Game! No winner...";
    } else {
      outcomeText.textContent = `${winner} wins!`;
    }
  };

  const playAgin = document.querySelector(".play-again");

  playAgin.addEventListener("click", () => {
    Game.resetBoard();
    // Clear UI
    clearAll();
    backdrop.style.display = "none";
    logo.style.filter = "invert(100%)";
  });

  const clearAll = () => {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach((cell) => {
      cell.textContent = "";
    });
  };

  return { renderGrid: grid, gameOver, updateCell, disableGrid, enableGrid };
})();

// DOMContentLoaded ensures the DOM is fully loaded before executing
document.addEventListener("DOMContentLoaded", () => {
  UI.renderGrid();
  // Start game or any other logic here
});

// Go over code very slowly - understand in full what is it doing and try to apply computer's move

// When it's computer's turn -> disable eventlistener for human move
