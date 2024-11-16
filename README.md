# Tic-Tac-Toe

A simple, interactive Tic-Tac-Toe game built using HTML, CSS, and JavaScript. This project follows a modular approach, organizing game logic and display functionality into separate objects for maintainability and scalability.

Features
Dynamic Game Board: The game board is stored as an array within a Gameboard object, allowing easy updates and checks for win conditions.
Player Objects: Each player is represented by an object, making it easy to manage player details and game flow.
Modular Game Control: A gameController object oversees the game flow, from determining valid moves to checking win conditions.
DOM Manipulation: A displayController module renders the game board and updates it based on player actions.
Winning and Tie Detection: Checks for all possible win combinations and ties to declare the game result.
Responsive UI: A clean interface allows players to input names, start/restart games, and view results in a responsive layout.
This project emphasizes modular design using JavaScript IIFEs and factory functions to ensure minimal global code and clean separation of concerns.