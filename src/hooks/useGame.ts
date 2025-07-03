// src/hooks/useGame.ts
import { useCallback, useEffect, useState } from "react";

export type GridType = (number | null)[][];
type Dir = "left" | "right" | "up" | "down";

const GRID_SIZE = 4;

/* ---------- Util funksiyalar ---------- */
const generateEmptyGrid = (): GridType =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null),
  );

const getRandomEmptyCell = (grid: GridType): [number, number] | null => {
  const empty: [number, number][] = [];
  grid.forEach((r, ri) =>
    r.forEach((c, ci) => c === null && empty.push([ri, ci])),
  );
  if (!empty.length) return null;
  return empty[Math.floor(Math.random() * empty.length)];
};

const addRandomTile = (grid: GridType): GridType => {
  const copy = grid.map((r) => [...r]);
  const pos = getRandomEmptyCell(copy);
  if (pos) {
    const [r, c] = pos;
    copy[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  return copy;
};

const compress = (row: (number | null)[]): (number | null)[] => {
  const nums = row.filter(Boolean);
  return [...nums, ...Array(GRID_SIZE - nums.length).fill(null)];
};

const merge = (
  row: (number | null)[],
  addScore: (v: number) => void,
): (number | null)[] => {
  const res = [...row];
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    if (res[i] && res[i] === res[i + 1]) {
      res[i] = res[i]! * 2;
      res[i + 1] = null;
      addScore(res[i]!);
    }
  }
  return compress(res);
};

const transpose = (g: GridType): GridType =>
  g[0].map((_, ci) => g.map((r) => r[ci]));

/* ---------- Hook ---------- */
export function useGame() {
  /* --- State --- */
  const [grid, setGrid] = useState<GridType>(generateEmptyGrid());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("highScore")) || 0,
  );

  /* --- Score helper --- */
  const incScore = useCallback(
    (v: number) => {
      setScore((s) => {
        const n = s + v;
        if (n > highScore) {
          setHighScore(n);
          localStorage.setItem("highScore", n.toString());
        }
        return n;
      });
    },
    [highScore],
  );

  /* --- Grid harakatini hisoblab beruvchi generator --- */
  const getMovedGrid = useCallback(
    (dir: Dir): GridType => {
      let newGrid: GridType;

      const moveRow = (row: (number | null)[]) =>
        merge(compress(row), incScore);

      if (dir === "left") {
        newGrid = grid.map(moveRow);
      } else if (dir === "right") {
        newGrid = grid.map((r) => moveRow([...r].reverse()).reverse());
      } else {
        // up / down orqali transpozitsiya
        const t = transpose(grid);
        if (dir === "up") {
          newGrid = transpose(t.map(moveRow));
        } else {
          newGrid = transpose(
            t.map((r) => moveRow([...r].reverse()).reverse()),
          );
        }
      }
      return newGrid;
    },
    [grid, incScore],
  );

  /* --- Harakatni tashqi komponentlarga export qiluvchi API --- */
  const move = useCallback(
    (dir: Dir) => {
      const next = getMovedGrid(dir);
      if (JSON.stringify(next) !== JSON.stringify(grid)) {
        setGrid(addRandomTile(next));
      }
    },
    [getMovedGrid, grid],
  );

  /* --- Boshlang‘ich grid --- */
  const initGame = useCallback(() => {
    setScore(0);
    setGrid(() => addRandomTile(addRandomTile(generateEmptyGrid())));
  }, []);

  /* --- Keydown listener --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  /* --- mount paytida o‘yinni boshlash --- */
  useEffect(initGame, [initGame]);

  return {
    grid,
    score,
    highScore,
    move,        // swipe/fizik tugmalar uchun
    restartGame: initGame,
  };
}
