# Tic Tac Toe Game

This is a implementation of the Tic Tac Toe game in JavaScript. It is playable directly in the browser and allows two players to take turns to place their marks on the board, with the game ending when one player wins or the board is full (resulting in a tie).

## Features

- Players take turns placing "X" and "O" marks on the board.
- The game checks for winning conditions (3-in-a-row) and ties.
- Player names can be set before starting the game.
- A button is available to start/reset the game.
- The results (winner or tie) are displayed at the end of the game.

## Project Setup

1. Clone the repository:
   
   ```bash
   git clone https://github.com/yuri-italo/tic-tac-toe.git
   ```

2. Navigate to the project directory:
   
   ```bash
   cd tic-tac-toe
   ```

3. Open `index.html` in your browser to play the game.

## Technologies Used

- **HTML**: Used for the structure of the game.
- **CSS**: Styled the gameboard and buttons for a better user interface.
- **JavaScript**: Handles game logic and DOM manipulation.

## How It Works

The game is designed using the following objects:

- **Gameboard**: Holds the state of the gameboard as an array and manages the logic for checking wins and ties.
- **Player**: Represents each player, storing their name and the mark ("X" or "O") they are using.
- **Game**: Controls the flow of the game, handling player turns, checking for winners, and rendering the board.

The game is designed to minimize global code, with most logic encapsulated in factory functions, and game state is managed within the relevant objects.

## How to Play

1. Enter your name and your opponent's name.
2. Click on a square to place your mark.
3. The game will automatically check if there is a winner or if the game ends in a tie.
