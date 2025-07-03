// src/hooks/useGame.ts
import { useCallback, useEffect, useState } from "react";

export type Dir = "left" | "right" | "up" | "down";

export interface TileData {
  value: number;
  isNew?: boolean;
  merged?: boolean;
}

export type GridType = (TileData | null)[][];

const GRID_SIZE = 4;

/* ---------- Util functions ---------- */
const generateEmptyGrid = (): GridType =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );

const getRandomEmptyCell = (grid: GridType): [number, number] | null => {
  const empty: [number, number][] = [];
  grid.forEach((r, ri) =>
    r.forEach((c, ci) => c === null && empty.push([ri, ci]))
  );
  if (!empty.length) return null;
  return empty[Math.floor(Math.random() * empty.length)];
};

const addRandomTile = (grid: GridType): GridType => {
  const copy = grid.map((r) => r.map((cell) =>
    cell ? { ...cell, isNew: false, merged: false } : null
  ));
  const pos = getRandomEmptyCell(copy);
  if (pos) {
    const [r, c] = pos;
    copy[r][c] = { value: Math.random() < 0.9 ? 2 : 4, isNew: true, merged: false };
  }
  return copy;
};

const compress = (row: (TileData | null)[]): (TileData | null)[] => {
  const nonNulls = row.filter((tile) => tile !== null) as TileData[];
  return [...nonNulls, ...Array(GRID_SIZE - nonNulls.length).fill(null)];
};

const merge = (
  row: (TileData | null)[],
  addScore: (v: number) => void
): (TileData | null)[] => {
  const newRow: (TileData | null)[] = [...row];
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    const curr = newRow[i];
    const next = newRow[i + 1];
    if (curr && next && curr.value === next.value) {
      const mergedValue = curr.value * 2;
      newRow[i] = { value: mergedValue, merged: true };
      newRow[i + 1] = null;
      addScore(mergedValue);
    }
  }
  return compress(newRow);
};

const transpose = (g: GridType): GridType =>
  g[0].map((_, ci) => g.map((r) => r[ci]));

const checkGameOver = (grid: GridType): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) return false;
      if (c < GRID_SIZE - 1 && grid[r][c]?.value === grid[r][c + 1]?.value) return false;
      if (r < GRID_SIZE - 1 && grid[r][c]?.value === grid[r + 1][c]?.value) return false;
    }
  }
  return true;
};

/* ---------- useGame Hook ---------- */
export function useGame() {
  const [grid, setGrid] = useState<GridType>(generateEmptyGrid());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore")) || 0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const incScore = useCallback(
    (v: number) => {
      setScore((s) => {
        const newScore = s + v;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("highScore", newScore.toString());
        }
        return newScore;
      });
    },
    [highScore]
  );

  const getMovedGrid = useCallback(
    (dir: Dir): GridType => {
      let newGrid: GridType;

      const moveRow = (row: (TileData | null)[]) => merge(compress(row), incScore);

      if (dir === "left") {
        newGrid = grid.map(moveRow);
      } else if (dir === "right") {
        newGrid = grid.map((r) => moveRow([...r].reverse()).reverse());
      } else {
        const t = transpose(grid);
        if (dir === "up") {
          newGrid = transpose(t.map(moveRow));
        } else {
          newGrid = transpose(t.map((r) => moveRow([...r].reverse()).reverse()));
        }
      }
      return newGrid;
    },
    [grid, incScore]
  );

  const move = useCallback(
    (dir: Dir) => {
      if (isGameOver || hasWon) return;

      const next = getMovedGrid(dir);
      if (JSON.stringify(next) !== JSON.stringify(grid)) {
        const withNew = addRandomTile(next);
        setGrid(withNew);

        const flat = withNew.flat().filter(Boolean) as TileData[];
        if (flat.some((tile) => tile.value === 2048)) {
          setHasWon(true);
        } else if (checkGameOver(withNew)) {
          setIsGameOver(true);
        }
      }
    },
    [getMovedGrid, grid, isGameOver, hasWon]
  );

  const initGame = useCallback(() => {
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
    setGrid(addRandomTile(addRandomTile(generateEmptyGrid())));
  }, []);

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

  useEffect(initGame, [initGame]);

  return {
    grid,
    score,
    highScore,
    isGameOver,
    hasWon,
    move,
    restartGame: initGame,
  };
}
