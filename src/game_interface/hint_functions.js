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

function check3together(matrix) {
  let x, y;
  x = matrix.findIndex((array) => {
    y = array.findIndex(
      (cell, index) =>
        cell !== 0 && cell === array[index + 1] && cell === array[index + 2]
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

function checkIfIdentical(matrix, isReversed) {
  const strArray = matrix.map((item) => JSON.stringify(item));
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

  if (duplicateIndex2 !== -1) {
    const errorMap = [];
    matrix.forEach((el, index) => {
      errorMap.push([duplicateIndex1, index]);
      errorMap.push([duplicateIndex2, index]);
    });
    return errorMap;
  }
  return null;
}

export function errorCheck(gameBoard, size) {
  const checkList = [
    {
      fuc: check3together,
      message: "3 boxes of the same color cannot be together",
    },
    { fuc: checkIfIdentical, message: "2 rows or columns cannot be the same" },
  ];

  const gameBoardInColumns = convertGameBoardToColumns(gameBoard, size);

  for (let item of checkList) {
    for (let index in [...Array(2)]) {
      const error = item.fuc(index === "0" ? gameBoard : gameBoardInColumns);
      if (error)
        return {
          error: generateErrorMap(size, error, index === "0" ? false : true),
          message: item.message,
        };
    }
  }
  return null;
}
