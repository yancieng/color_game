function check3together(matrix, isReversed) {
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
      { row: isReversed ? y : x, column: isReversed ? x : y },
      {
        row: isReversed ? y + 1 : x,
        column: isReversed ? x : y + 1,
      },
      {
        row: isReversed ? y + 2 : x,
        column: isReversed ? x : y + 2,
      },
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
      errorMap.push({
        row: isReversed ? index : duplicateIndex1,
        column: isReversed ? duplicateIndex1 : index,
      });
      errorMap.push({
        row: isReversed ? index : duplicateIndex2,
        column: isReversed ? duplicateIndex2 : index,
      });
    });
    return errorMap;
  }
  return null;
}

export function errorCheck(systemBoard) {
  const rowError = check3together(systemBoard.rows);
  if (rowError)
    return {
      error: rowError,
      message: "3 boxes of the same color cannot be together",
    };

  const columnError = check3together(systemBoard.columns, true);
  if (columnError)
    return {
      error: columnError,
      message: "3 boxes of the same color cannot be together",
    };

  const duplicateRow = checkIfIdentical(systemBoard.rows);
  if (duplicateRow)
    return {
      error: duplicateRow,
      message: "2 rows or columns cannot be the same",
    };

  const duplicateColumn = checkIfIdentical(systemBoard.columns, true);
  if (duplicateColumn)
    return {
      error: duplicateColumn,
      message: "2 rows or columns cannot be the same",
    };

  return null;
}
