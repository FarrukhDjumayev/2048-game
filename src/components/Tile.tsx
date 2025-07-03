// src/components/Tile.tsx
import React from "react";

interface TileProps {
  value: number | null;
}

export default function Tile({ value }: TileProps) {
  const tileColors: { [key: number]: string } = {
    2: "from-[#00ff7f] to-[#00e6b8]",
    4: "from-[#ff4d4d] to-[#ff1a1a]",
    8: "from-[#ff6ec4] to-[#7873f5]",
    16: "from-[#39ff14] to-[#00ff7f]",
    32: "from-[#ff073a] to-[#ff9800]",
    64: "from-[#ff0] to-[#f00]",
    128: "from-[#00ffff] to-[#00bfff]",
    256: "from-[#ff4f81] to-[#ff6ec4]",
    512: "from-[#43e97b] to-[#38f9d7]",
    1024: "from-[#ff6a00] to-[#ee0979]",
    2048: "from-[#ffe259] to-[#ffa751]",
  };

  const getTileStyle = () => {
    if (!value) return "bg-[#1a1a1a40] border border-[#00ff7f]/40";
    const gradient = tileColors[value] || "from-[#ff00cc] to-[#333399]";
    const borderColor = value >= 128 ? "border-[#00ff7f]" : "border-[#ff1a1a]";
    return `bg-gradient-to-br ${gradient} text-white border-2 ${borderColor} shadow-[0_0_12px_rgba(255,255,255,0.2)]`;
  };

  return (
    <div
      className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-2xl transition-all duration-300 ${getTileStyle()}`}
    >
      {value || ""}
    </div>
  );
}
