import { useState } from "react";
import Interface from "./game_interface/";

const GAME_LIST = [4, 6, 8, 10, 12];
function App() {
  const [page, setPage] = useState("menu");
  const [size, setSize] = useState();

  const handleClick = (item) => {
    setSize(item);
    setPage("game");
  };

  const Menu = () => (
    <div className="menu">
      <div className="title">Pick a size to start:</div>
      <div className="sizePicker">
        {GAME_LIST.map((item, index) => (
          <div
            className={`block ${index % 2 === 0 ? "red" : "blue"}`}
            key={index}
            onClick={() => handleClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="layout">
      {page === "menu" && <Menu />}
      {page === "game" && <Interface size={size} />}
    </div>
  );
}

export default App;
