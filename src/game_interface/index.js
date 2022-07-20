import { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import Controls from "./Controls";
import grid4 from "../game_data/grid4.json";

const GameData = {
  4: grid4,
};

const Interface = ({ size }) => {
  const [randomBoard, setRandomBoard] = useState([]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    const data = GameData[size];
    console.log("size, GameData[size]", size, GameData[size]);
    const randomNumber = getRandomInt(data.length);
    setRandomBoard(data[randomNumber]);
  }, [size]);

  return (
    <>
      <GameBoard defaultBoard={randomBoard} size={size} />
      <Controls />
    </>
  );
};

export default Interface;
