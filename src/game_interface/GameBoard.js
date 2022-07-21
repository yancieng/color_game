import React, { useEffect, useState } from "react";
import { GoLock } from "react-icons/go";
import { BiUndo, BiRefresh } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { errorCheck } from "./hint_functions";

const CellColor = {
  0: "grey",
  1: "red",
  2: "blue",
};

const GameBoard = ({ defaultBoard, size }) => {
  const [gameBoard, setGameBoard] = useState([]);
  const [displayLock, setDisplayLock] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState([]);
  const [memory, setMemory] = useState([]);

  const initialise = () => {
    // const initialValue = [...Array(size)].map(() => []);
    // const columns = defaultBoard.reduce((previousValue, row) => {
    //   row.forEach((el, index) => {
    //     previousValue[index].push(el);
    //   });
    //   return previousValue;
    // }, initialValue);
    const _gameBoard = JSON.parse(JSON.stringify(defaultBoard));
    setGameBoard(_gameBoard);
    setMemory([_gameBoard]);
  };

  useEffect(() => {
    initialise();
  }, [defaultBoard, size]);

  const handleOnClick = ({ row, column, locked }) => {
    if (locked) {
      setDisplayLock(!displayLock);
      return;
    }
    if (message !== "") removeHint();

    const currentValue = gameBoard[row][column];
    let newValue;
    if (currentValue < 2) newValue = currentValue + 1;
    if (currentValue === 2) newValue = 0;

    const _gameBoard = JSON.parse(JSON.stringify(gameBoard));
    const _memory = JSON.parse(JSON.stringify(memory));
    _gameBoard[row][column] = newValue;
    _memory.push(gameBoard);

    setMemory(_memory);
    setGameBoard(_gameBoard);
  };

  const handleUndo = () => {
    if (message !== "") removeHint();
    if (memory.length > 0) {
      const _memory = JSON.parse(JSON.stringify(memory));
      setGameBoard(memory[memory.length - 1]);
      _memory.pop();
      setMemory(_memory);
    }
  };

  const handleHint = () => {
    if (message !== "") {
      removeHint();
      return;
    }
    const result = errorCheck(gameBoard, size);
    if (result) {
      setError(result.error);
      setMessage(result.message);
    }
  };

  const removeHint = () => {
    setError([]);
    setMessage("");
  };

  return (
    <>
      <div className="message">{message}</div>
      <div
        className="gameboard"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {gameBoard.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`block ${CellColor[column]} ${
                  error[rowIndex]?.[columnIndex] ? "error" : ""
                }`}
                onClick={() =>
                  handleOnClick({
                    row: rowIndex,
                    column: columnIndex,
                    locked: defaultBoard[rowIndex][columnIndex] !== 0,
                  })
                }
              >
                {displayLock && defaultBoard[rowIndex][columnIndex] !== 0 && (
                  <GoLock />
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="controls">
        <div onClick={handleUndo}>
          <BiUndo />
          <br />
          Undo
        </div>
        <div>
          <AiFillEye onClick={handleHint} />
          <br />
          Hint
        </div>
        <div>
          <BiRefresh onClick={initialise} />
          <br />
          Restart
        </div>
      </div>
    </>
  );
};

export default GameBoard;
