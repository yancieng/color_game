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
  const [systemBoard, setSystemBoard] = useState({ rows: [], columns: [] });
  const [gameBoard, setGameBoard] = useState([]);
  const [displayLock, setDisplayLock] = useState(false);
  const [message, setMessage] = useState("");
  const [memory, setMemory] = useState([]);

  const initialise = () => {
    const initialValue = [...Array(size)].map(() => []);
    const columns = defaultBoard.reduce((previousValue, row) => {
      row.forEach((el, index) => {
        previousValue[index].push(el);
      });
      return previousValue;
    }, initialValue);
    const _systemBoard = { rows: defaultBoard, columns };
    setSystemBoard(_systemBoard);

    const _gameBoard = defaultBoard.map((row) =>
      row.map((cell) => ({
        color: cell,
        error: false,
        locked: cell !== 0,
      }))
    );
    setGameBoard(_gameBoard);

    setMemory([{ systemBoard: _systemBoard, gameBoard: _gameBoard }]);
  };

  useEffect(() => {
    initialise();
  }, [defaultBoard, size]);

  const handleOnClick = ({ row, column, locked }) => {
    if (locked) {
      setDisplayLock(!displayLock);
      return;
    }
    const currentValue = gameBoard[row][column].color;
    let newValue;
    if (currentValue < 2) newValue = currentValue + 1;
    if (currentValue === 2) newValue = 0;

    const _gameBoard = JSON.parse(JSON.stringify(gameBoard));
    _gameBoard[row][column].color = newValue;

    const _systemBoard = JSON.parse(JSON.stringify(systemBoard));
    _systemBoard.rows[row][column] = newValue;
    _systemBoard.columns[column][row] = newValue;

    const _memory = JSON.parse(JSON.stringify(memory));
    _memory.push({ gameBoard, systemBoard });

    setMemory(_memory);
    setGameBoard(_gameBoard);
    setSystemBoard(_systemBoard);
  };

  const handleUndo = () => {
    if (memory.length > 0) {
      const _memory = JSON.parse(JSON.stringify(memory));
      setGameBoard(memory[memory.length - 1].gameBoard);
      setSystemBoard(memory[memory.length - 1].systemBoard);
      _memory.pop();
      setMemory(_memory);
    }
  };

  const handleHint = () => {
    if (message !== "") {
      const _gameBoard = JSON.parse(JSON.stringify(gameBoard));
      _gameBoard.forEach((row) => row.forEach((cell) => (cell.error = false)));
      setMessage("");
      setGameBoard(_gameBoard);
      return;
    }
    const result = errorCheck(systemBoard);
    if (result) {
      displayError(result.error);
      setMessage(result.message);
    }
  };

  const displayError = (errors) => {
    const _gameBoard = JSON.parse(JSON.stringify(gameBoard));
    errors.forEach((item) => {
      _gameBoard[item.row][item.column].error = true;
    });
    setGameBoard(_gameBoard);
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
                className={`block ${CellColor[column.color]} ${
                  column.error ? "error" : ""
                }`}
                onClick={() =>
                  handleOnClick({
                    row: rowIndex,
                    column: columnIndex,
                    locked: column.locked,
                  })
                }
              >
                {displayLock && column.locked && <GoLock />}
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
