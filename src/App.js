import React, { useState, useEffect } from "react";
import cookieImage from "./cookie.png";
import "./App.css";

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 20;

const getRandomCoord = () => {
  return {
    row: Math.floor(Math.random() * ROWS),
    col: Math.floor(Math.random() * COLS),
  };
};

function App() {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(getRandomCoord());
  const [direction, setDirection] = useState("right");
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const handleKeyPress = (event) => {
        if (event.keyCode === 37) setDirection("left");
        if (event.keyCode === 38) setDirection("up");
        if (event.keyCode === 39) setDirection("right");
        if (event.keyCode === 40) setDirection("down");
      };
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const intervalId = setInterval(() => {
        const head = snake[0];
        let newHead;
        if (direction === "left")
          newHead = { row: head.row, col: head.col - 1 };
        if (direction === "up") newHead = { row: head.row - 1, col: head.col };
        if (direction === "right")
          newHead = { row: head.row, col: head.col + 1 };
        if (direction === "down")
          newHead = { row: head.row + 1, col: head.col };
        const newSnake = [newHead, ...snake.slice(0, -1)];
        setSnake(newSnake);

        if (newHead.row === food.row && newHead.col === food.col) {
          setFood(getRandomCoord());
          setSnake([...snake, snake[snake.length - 1]]);
        }

        if (
          newHead.row < 0 ||
          newHead.row >= ROWS ||
          newHead.col < 0 ||
          newHead.col >= COLS ||
          newSnake
            .slice(1)
            .some(
              (cell) => cell.row === newHead.row && cell.col === newHead.col
            )
        ) {
          setGameOver(true);
          clearInterval(intervalId);
        }
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [snake, food, direction, gameStarted, gameOver]);

  const handleStartGame = () => {
    setSnake([{ row: 10, col: 10 }]);
    setFood(getRandomCoord());
    setDirection("right");
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <div style={{ height: "13rem" }}>
        <h1>Snake Game</h1>
        <p>Score: {snake.length}</p>
        <div>
          {!gameStarted ? (
            <button className="secondary-button" onClick={handleStartGame}>
              Start Game
            </button>
          ) : null}
          {gameOver && (
            <>
              <p>Game Over!</p>
              <button className="primary-button" onClick={handleStartGame}>
                Restart
              </button>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          border: "2px solid darkgrey",
          display: "grid",
          margin: "0 auto",
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
          width: "fit-content",
        }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;
          const isSnake = snake.some(
            (cell) => cell.row === row && cell.col === col
          );
          const isFood = food.row === row && food.col === col;
          return (
            <div
              key={index}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: isSnake ? "green" : "white",
                backgroundImage: isFood ? `url(${cookieImage})` : "none",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
