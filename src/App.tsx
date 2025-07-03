// src/App.tsx
import React from "react";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import { useGame } from "./hooks/useGame";
import { useSwipeable } from "react-swipeable";

export default function App() {
  const { grid, score, highScore, restartGame, move } = useGame();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => move("left"),
    onSwipedRight: () => move("right"),
    onSwipedUp: () => move("up"),
    onSwipedDown: () => move("down"),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div
      {...swipeHandlers}
      className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4"
    >
      <div>
        <Header score={score} highScore={highScore} onRestart={restartGame} />
        <GameBoard grid={grid} />
      </div>
    </div>
  );
}
