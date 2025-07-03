// src/components/GameBoard.tsx

import Tile from "./Tile";
import type { GridType } from "../hooks/useGame";

interface GameBoardProps {
  grid: GridType;
}

export default function GameBoard({ grid }: GameBoardProps) {
  return (
    <div className="p-4 rounded-2xl border-4 border-[#00ff7f]/50 shadow-[0_0_30px_#00ff7f66] bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f]">
      <div className="grid grid-cols-4 gap-4">
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={value} />
          ))
        )}
      </div>
    </div>
  );
}
