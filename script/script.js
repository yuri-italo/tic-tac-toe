const GameBoard = (function () {
  const board = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => createCell())
  );

  function availableCell(row, column) {
    return board[row][column].getValue() === null;
  }

  const getBoard = () => board;

  const selectCell = (player, row, column) => {
    if (availableCell(row, column)) {
      board[row][column].addValue(player);
      return true;
    }

    return false;
  };

  return { getBoard, selectCell };
})();

function createCell() {
  let value = null;

  const addValue = (newValue) => {
    value = newValue;
  };

  const getValue = () => value;

  return { addValue, getValue };
}

function createPlayer(name, mark) {
  let active = false;

  const getName = () => name;
  const getMark = () => mark;
  const isActive = () => active;
  const toggleStatus = function () {
    active = !active;
  };

  return { getName, getMark, isActive, toggleStatus };
}

const GameController = (function () {
  const players = [
    createPlayer(playerOneName, "X"),
    createPlayer(playerTwoName, "O"),
  ];

  players[0].toggleStatus();

  const switchPlayerTurn = () => {
    players.forEach((player) => player.toggleStatus());
  };

  const getActivePlayer = () => {
    return players.find((player) => player.isActive());
  };

  const validateMove = (player, row, column) => {
    if (!player.isActive()) {
      throw new Error(`Player ${player.getName()} is inactive.`);
    }

    if (row < 0 || row > 2 || column < 0 || column > 2) {
      throw new Error(`Cell at row ${row}, column ${column} does not exist.`);
    }

    if (!GameBoard.selectCell(player, row, column)) {
      return false;
    }

    switchPlayerTurn();
    return true;
  };

  const hasWinner = () => {
    const boardValues = GameBoard.getBoard().map((row) =>
      row.map((cell) => cell.getValue()?.getMark())
    );
    const checkLine = (line) => line.every((mark) => mark && mark === line[0]);

    for (let i = 0; i < 3; i++) {
      if (
        checkLine(boardValues[i]) ||
        checkLine(boardValues.map((row) => row[i]))
      ) {
        return true;
      }
    }

    return (
      checkLine([boardValues[0][0], boardValues[1][1], boardValues[2][2]]) ||
      checkLine([boardValues[0][2], boardValues[1][1], boardValues[2][0]])
    );
  };

  const isDraw = () => {
    const boardValues = GameBoard.getBoard();
    return (
      boardValues.every((row) =>
        row.every((cell) => cell.getValue() !== null)
      ) && !hasWinner()
    );
  };

  const playRound = (row, column) => {
    const activePlayer = getActivePlayer();
    if (validateMove(activePlayer, row, column)) {
      if (hasWinner()) {
      } else if (isDraw()) {
      } else {
      }
    }
  };

  return { playRound, getActivePlayer, getBoard: GameBoard.getBoard };
})((playerOneName = "Player 1"), (playerTwoName = "Player 2"));

const ScreenController = (function () {
  const gameController = GameController();
  
})();
