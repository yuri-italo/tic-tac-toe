function createGameBoard() {
  const board = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => createCell())
  );

  function availableCell(row, column) {
    return board[row][column].getValue() === null;
  }

  const getBoard = () => board;

  const selectCell = (player, row, column) => {
    if (!availableCell(row, column)) {
      return;
    }
    board[row][column].addValue(player);
  };

  const printBoard = () => {
    const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardValues);
  };

  return { getBoard, selectCell, printBoard };
}

function createCell() {
  let value = null;

  const addValue = (newValue) => {
    value = newValue;
  };

  const getValue = () => value;

  return { addValue, getValue };
}
