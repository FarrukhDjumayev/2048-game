// src/components/Header.tsx

interface HeaderProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function Header({ score, highScore, onRestart }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-extrabold text-[#00ff7f] drop-shadow-[0_0_8px_#00ff7f]">
        2048
      </h1>

      <div className="flex items-center gap-4">
        <div className="bg-[#111] text-green-300 border border-green-500 px-4 py-2 rounded-lg shadow-inner text-center">
          <div className="text-sm uppercase">Score</div>
          <div className="text-xl font-bold">{score}</div>
        </div>

        <div className="bg-[#111] text-red-300 border border-red-500 px-4 py-2 rounded-lg shadow-inner text-center">
          <div className="text-sm uppercase">Best</div>
          <div className="text-xl font-bold">{highScore}</div>
        </div>

        <button
          onClick={onRestart}
          className="bg-[#000] border-2 border-green-400 text-green-300 px-4 py-2 rounded-lg shadow-lg hover:border-red-400 hover:text-red-400 transition-all duration-300"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
