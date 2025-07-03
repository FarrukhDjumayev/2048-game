// src/components/Tile.tsx

interface TileProps {
  value: number | null;
  isNew?: boolean;
  merged?: boolean;
}

export default function Tile({ value, isNew, merged }: TileProps) {
  const tileColors: { [key: number]: string } = {
    2: "from-[#00ff7f] to-[#00e6b8]",
    4: "from-[#ff4d4d] to-[#ff1a1a]",
    8: "from-[#ff6ec4] to-[#7873f5]",
    16: "from-[#39ff14] to-[#00ff7f]",
    32: "from-[#ff073a] to-[#ff9800]",
    64: "from-[#ffff00] to-[#ff0000]",
    128: "from-[#00ffff] to-[#00bfff]",
    256: "from-[#ff4f81] to-[#ff6ec4]",
    512: "from-[#43e97b] to-[#38f9d7]",
    1024: "from-[#ff6a00] to-[#ee0979]",
    2048: "from-[#ffe259] to-[#ffa751]",
  };

  const getTileStyle = () => {
    if (!value) return "bg-[#1a1a1a40]/40 backdrop-blur border border-[#00ff7f]/40";
    const gradient = tileColors[value] || "from-[#ff00cc] to-[#333399]";
    const borderColor = value >= 128 ? "border-[#00ff7f]" : "border-[#1a1b]";
    const special = value === 2048 ? "animate-victory" : "";
    return `bg-gradient-to-br ${gradient} text-white border-2 ${borderColor} shadow-[0_0_12px_rgba(255,255,255,0.2)] ${special}`;
  };

  const getAnimationClass = () => {
    if (isNew) return "animate-pop";
    if (merged) return "animate-mergePulse";
    return "";
  };

  const getTextSize = () => {
    if (!value) return "";
    if (value < 100) return "text-2xl md:text-3xl lg:text-4xl";
    if (value < 1000) return "text-xl md:text-2xl lg:text-3xl";
    return "text-lg md:text-xl lg:text-2xl";
  };

  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 
        rounded-xl flex items-center justify-center font-bold 
        transition-all duration-300 select-none 
        ${getTileStyle()} ${getAnimationClass()} ${getTextSize()}`}
      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}
    >
      {value || ""}
    </div>
  );
}

/* Tailwind CSS uchun animation class larini global.css yoki index.css ga qo‘shing:

@keyframes pop {
  0% { transform: scale(0.5); opacity: 0.3; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes mergePulse {
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
  50% { transform: scale(1.25); box-shadow: 0 0 25px rgba(255,255,255,0.3); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
}

@keyframes victory {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px #fff; }
  50% { transform: scale(1.2); box-shadow: 0 0 30px gold; }
}

.animate-pop { animation: pop 0.3s ease-out; }
.animate-mergePulse { animation: mergePulse 0.35s ease-in-out; }
.animate-victory { animation: victory 1s ease-in-out infinite; }
*/
