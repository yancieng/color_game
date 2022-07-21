import React, { useEffect, useState } from "react";
import { BiUndo, BiRefresh, BiLockAlt } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import { errorCheck } from "./hintFunctions";

const CellColor = {
  0: "grey",
  1: "red",
  2: "blue",
};

const GameBoard = ({ defaultBoard, size, backToMenu }) => {
  const [gameBoard, setGameBoard] = useState([]);
  const [displayLock, setDisplayLock] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState([]);
  const [memory, setMemory] = useState([]);

  const initialise = () => {
    const _gameBoard = JSON.parse(JSON.stringify(defaultBoard));
    setGameBoard(_gameBoard);
    setMemory([_gameBoard]);
    setMessage("");
    setError([]);
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
                  <BiLockAlt />
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
        <div>
          <IoIosClose onClick={backToMenu} />
          <br />
          Cancel
        </div>
      </div>
    </>
  );
};

export default GameBoard;
