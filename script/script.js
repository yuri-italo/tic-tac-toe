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

const GameController = function (playerOneName, playerTwoName) {
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

    if (!validateMove(activePlayer, row, column)) {
      return "This spot is already taken.";
    }

    if (hasWinner()) {
      return `${activePlayer.getName()} has won the game!`;
    }

    if (isDraw()) {
      return "It's a draw!";
    }

    switchPlayerTurn();
    return `${getActivePlayer().getName()}'s turn!`;
  };

  return { playRound, getActivePlayer, getBoard: GameBoard.getBoard };
};

const ScreenController = (function () {
  let gameController;
  const inputs = document.querySelectorAll("input");
  const btnStart = document.querySelector(".btn-start");
  const btnReset = document.querySelector(".btn-reset");
  const cells = document.querySelectorAll(".board-cell");

  btnStart.addEventListener("click", handleStartGame);
  btnReset.addEventListener("click", handleResetGame);

  changeDisplay("Enter the players' names to start.");

  function handleStartGame(event) {
    event.preventDefault();
    const isDisabled = event.target.classList.contains("btn-disabled");

    if (!isDisabled) {
      const playerOneName = inputs[0].value || "Player One";
      const playerTwoName = inputs[1].value || "Player Two";

      inputs[0].value = playerOneName;
      inputs[1].value = playerTwoName;

      gameController = GameController(playerOneName, playerTwoName);

      disableInputs(inputs);
      disableButton(btnStart);
      enableButton(btnReset);
      enableCells();
      changeDisplay(`${gameController.getActivePlayer().getName()}'s turn!`);
    }
  }

  function handleResetGame(event) {
    event.preventDefault();
    const isDisabled = event.target.classList.contains("btn-disabled");

    if (!isDisabled) {
      enableInputs(inputs);
      enableButton(btnStart);
      disableButton(btnReset);
      clearGrid();
      changeDisplay("Enter the players' names to start.");
    }
  }

  function handleSelectCell(event) {
    if (gameController) {
      const cell = event.target;

      const msg = gameController.playRound(
        cell.getAttribute("data-row"),
        cell.getAttribute("data-column")
      );

      if (msg.includes("has won") || msg === "It's a draw!") {
        disableCells();
      }

      populateGrid();
      changeDisplay(msg);
    }
  }

  function changeDisplay(msg) {
    document.querySelector(".display p").innerText = msg;
  }

  function disableInputs(inputs) {
    inputs.forEach((input) => input.setAttribute("disabled", ""));
  }

  function enableInputs(inputs) {
    inputs.forEach((input) => input.removeAttribute("disabled"));
  }

  function disableButton(button) {
    button.classList.add("btn-disabled");
  }

  function enableButton(button) {
    button.classList.remove("btn-disabled");
  }

  function enableCell(cell) {
    cell.classList.add("active-cell");
  }

  function enableCells() {
    cells.forEach((cell) => {
      cell.addEventListener("click", handleSelectCell);
      enableCell(cell);
    });
  }

  function disableCell(cell) {
    cell.classList.remove("active-cell");
  }

  function disableCells() {
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleSelectCell);
      disableCell(cell);
    });
  }

  function changeCellValue(cell, value) {
    cell.innerText = value;
  }

  function clearGrid() {
    const board = gameController.getBoard();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        board[i][j].addValue(null);
      }
    }

    cells.forEach((cell) => {
      cell.removeEventListener("click", handleSelectCell);
      cell.innerText = "";
      disableCell(cell);
    });
  }

  function populateGrid() {
    const board = gameController.getBoard();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        const player = board[i][j].getValue();

        if (player) {
          const cell = document.querySelector(
            `[data-row="${i}"][data-column="${j}"]`
          );

          changeCellValue(cell, player.getMark());
          disableCell(cell);
        }
      }
    }
  }
})();
