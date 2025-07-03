// src/App.tsx
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import { useGame } from "./hooks/useGame";
import { useSwipeable } from "react-swipeable";
import Particles from "./Particles";
import Modal from "./components/Modal"; // ✅

export default function App() {
  const {
    grid,
    score,
    highScore,
    restartGame,
    move,
    hasWon,
    isGameOver,
  } = useGame();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => move("left"),
    onSwipedRight: () => move("right"),
    onSwipedUp: () => move("up"),
    onSwipedDown: () => move("down"),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between">
      {/* ✅ BACKGROUND PARTICLES */}
      <div className="absolute inset-0 z-0 bg-black">
        <Particles
          particleColors={["#39ff14", "#39ff14"]}
          particleCount={600}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* ✅ FOREGROUND: GAME */}
      <div
        {...swipeHandlers}
        className="relative z-10 flex flex-col items-center justify-center flex-grow px-4"
      >
        <div className="backdrop-blur-sm bg-black/20 p-4 rounded-2xl shadow-2xl">
          <Header score={score} highScore={highScore} onRestart={restartGame} />
          <GameBoard grid={grid} />
        </div>
      </div>

      {/* ✅ FOOTER: Fixed to bottom */}
      <footer className="z-10 relative text-center text-xs text-green-400 opacity-70 mb-2">
        Created by Farrukh Djumayev
      </footer>

      {/* ✅ MODALS */}
      {hasWon && (
        <Modal
          title="🎉 Tabriklaymiz!"
          message={`Siz 2048 raqamiga yetdingiz. Ball: ${score}`}
          onClose={restartGame}
        />
      )}

      {isGameOver && !hasWon && (
        <Modal
          title="❌ O‘yin tugadi"
          message={`Siz ${score} ball yig‘dingiz. Yana urinib ko‘ring!`}
          onClose={restartGame}
        />
      )}
    </div>
  );
}
