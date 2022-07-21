function convertGameBoardToColumns(gameBoard, size) {
  const initialValue = [...Array(size)].map(() => []);
  return gameBoard.reduce((previousValue, row) => {
    row.forEach((el, index) => {
      previousValue[index].push(el);
    });
    return previousValue;
  }, initialValue);
}

function generateErrorMap(size, errorArray, isReversed) {
  return [...Array(size)].map((el, rowIndex) =>
    [...Array(size)].map((el, columnIndex) =>
      errorArray.find((item) => {
        if (isReversed) return item[0] === columnIndex && item[1] === rowIndex;
        return item[0] === rowIndex && item[1] === columnIndex;
      })
    )
  );
}

function markWholeRow(rows, size) {
  const errorMap = [];
  rows.forEach((rowIndex) => {
    [...Array(size)].forEach((el, index) => {
      errorMap.push([parseInt(rowIndex), index]);
    });
  });
  return errorMap;
}

function check3together(gameBoard) {
  let x, y;
  x = gameBoard.findIndex((row) => {
    y = row.findIndex(
      (cell, index) =>
        cell !== 0 && cell === row[index + 1] && cell === row[index + 2]
    );
    return y !== -1;
  });

  if (x !== -1 && y !== -1)
    return [
      [x, y],
      [x, y + 1],
      [x, y + 2],
    ];
  return null;
}

function checkIfIdentical(gameboard, size) {
  const strArray = gameboard.map((item) => JSON.stringify(item));
  let duplicateIndex1, duplicateIndex2;
  duplicateIndex2 = strArray.findIndex((item, index) => {
    const incompleteRow = JSON.parse(item).findIndex((cell) => cell === 0);
    if (incompleteRow === -1) {
      const fistIndex = strArray.indexOf(item);
      const isDup = fistIndex !== index;
      if (isDup) {
        duplicateIndex1 = fistIndex;
        return true;
      }
    }
    return false;
  });

  if (duplicateIndex2 !== -1)
    return markWholeRow([duplicateIndex1, duplicateIndex2], size);

  return null;
}

function checkEvenColorOverLimit(gameboard, size) {
  const max = size / 2;
  for (let rowIndex in gameboard) {
    let red = 0;
    let blue = 0;
    for (let cell of gameboard[rowIndex]) {
      if (cell === 1) red++;
      if (cell === 2) blue++;
      if (red > max || blue > max) return markWholeRow([rowIndex], size);
    }
  }
  return null;
}

function checkEvenColorUnderLimit(gameboard, size) {
  const max = size / 2;
  for (let rowIndex in gameboard) {
    const incompleteRow = gameboard[rowIndex].findIndex((cell) => cell === 0);
    if (incompleteRow !== -1) {
      let red = 0;
      let blue = 0;
      for (let cell of gameboard[rowIndex]) {
        if (cell === 1) red++;
        if (cell === 2) blue++;
        if (red === max || blue === max) return markWholeRow([rowIndex], size);
      }
    }
  }
  return null;
}

function check2together(gameboard) {
  let x, y;
  x = gameboard.findIndex((array) => {
    y = array.findIndex((cell, index) => {
      const twoTogether = cell !== 0 && cell === array[index + 1];
      const emptyOnEitherEnd = array[index - 1] === 0 || array[index + 2] === 0;
      return twoTogether && emptyOnEitherEnd;
    });
    return y !== -1;
  });

  if (x !== -1 && y !== -1)
    return [
      [x, y],
      [x, y + 1],
      ...(gameboard[x][y - 1] === 0 ? [[x, y - 1]] : []),
      ...(gameboard[x][y + 2] === 0 ? [[x, y + 2]] : []),
    ];
  return null;
}

function checkHollow(gameboard) {
  let x, y;
  x = gameboard.findIndex((array) => {
    y = array.findIndex(
      (cell, index) =>
        cell !== 0 && array[index + 1] === 0 && cell === array[index + 2]
    );
    return y !== -1;
  });

  if (x !== -1 && y !== -1)
    return [
      [x, y],
      [x, y + 1],
      [x, y + 2],
    ];

  return null;
}

function checkForIdenticalRowHint(gameBoard, size) {
  let dup2;
  const dup1 = gameBoard.findIndex((row) => {
    const incompleteRow = row.filter((cell) => cell === 0);
    const rowMissingTwo = incompleteRow.length === 2;
    if (!rowMissingTwo) return false;

    dup2 = gameBoard.findIndex((row2) => {
      const completedRow = row2.every((cell) => cell > 0);
      if (completedRow) {
        const identical = row2.every(
          (cell, index) => row[index] === 0 || row[index] === cell
        );
        return identical;
      }
      return false;
    });
    return dup2 !== -1;
  });

  if (dup1 !== -1) return markWholeRow([dup1, dup2], size);
}

export function errorCheck(gameBoard, size) {
  const checkList = [
    {
      fuc: check3together,
      message: "3 tiles of the same color cannot be together",
    },
    {
      fuc: checkIfIdentical,
      message: "2 rows or columns cannot be the same",
    },
    {
      fuc: checkEvenColorOverLimit,
      message: "Each row or column should have even numbers of color tiles",
    },
    {
      fuc: check2together,
      message: "3 tiles of the same color cannot be together",
    },
    {
      fuc: checkHollow,
      message: "3 tiles of the same color cannot be together",
    },
    {
      fuc: checkEvenColorUnderLimit,
      message: "Each row or column should have even numbers of color tiles",
    },
    {
      fuc: checkForIdenticalRowHint,
      message: "2 rows or columns cannot be the same",
    },
  ];

  const gameBoardInColumns = convertGameBoardToColumns(gameBoard, size);

  for (let item of checkList) {
    for (let index in [...Array(2)]) {
      const error = item.fuc(
        index === "0" ? gameBoard : gameBoardInColumns,
        size
      );
      if (error)
        return {
          error: generateErrorMap(size, error, index === "0" ? false : true),
          message: item.message,
        };
    }
  }
  return null;
}
