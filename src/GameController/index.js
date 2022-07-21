import { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import * as data from "../Data";

const GameData = {
  4: data.grid4,
  6: data.grid6,
  8: data.grid8,
  10: data.grid10,
  12: data.grid12,
};

const GameController = ({ size, setPage }) => {
  const [randomBoard, setRandomBoard] = useState([]);

  const getRandomInt = (max) => Math.floor(Math.random() * max);

  useEffect(() => {
    const data = GameData[size];
    const randomNumber = getRandomInt(data.length);
    setRandomBoard(data[randomNumber]);
  }, [size]);

  const backToMenu = () => setPage("menu");

  return (
    <GameBoard defaultBoard={randomBoard} size={size} backToMenu={backToMenu} />
  );
};

export default GameController;
