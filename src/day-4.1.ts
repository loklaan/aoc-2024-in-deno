import { Solution } from "@/lib/cli.ts";

const word = "XMAS";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const grid = input.split("\n").map((l) => l.trim()).filter((x) => x).map(
    (l) => l.split(""),
  );

  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    const points = grid[y];
    for (let x = 0; x < points.length; x++) {
      debug(`XY: ${x},${y}`);
      const leftToRight = Array(word.length).fill("-").map((_, i) =>
        points[x + i]
      ).join("");
      // debug(`LeftToRight: ${leftToRight}`);
      if (leftToRight === word) count++;
      const rightToLeft = Array(word.length).fill("-").map((_, i) =>
        points[x - i] ?? "-"
      ).join("");
      // debug(`RightToLeft: ${rightToLeft}`);
      if (rightToLeft === word) count++;
      const topToBottom = Array(word.length).fill("-").map((_, i) =>
        grid[y + i]?.[x] ?? "-"
      ).join("");
      // debug(`TopToBottom ${topToBottom}`)
      if (topToBottom === word) count++;
      const bottomToTop = Array(word.length).fill("-").map((_, i) =>
        grid[y - i]?.[x] ?? "-"
      ).join("");
      // debug(`BottomToTop ${bottomToTop}`)
      if (bottomToTop === word) count++;
      const diagonalPosYPosX = Array(word.length).fill("-").map((_, i) =>
        grid[y + i]?.[x + i] ?? "-"
      ).join("");
      // debug(`DiagonalPosYPosX ${diagonalPosYPosX}`)
      if (diagonalPosYPosX === word) count++;
      const diagonalNegYPosX = Array(word.length).fill("-").map((_, i) =>
        grid[y - i]?.[x + i] ?? "-"
      ).join("");
      // debug(`DiagonalNegYPosX ${diagonalNegYPosX}`)
      if (diagonalNegYPosX === word) count++;
      const diagonalPosYNegX = Array(word.length).fill("-").map((_, i) =>
        grid[y + i]?.[x - i] ?? "-"
      ).join("");
      // debug(`DiagonalPosYNegX ${diagonalPosYNegX}`)
      if (diagonalPosYNegX === word) count++;
      const diagonalNegYNegX = Array(word.length).fill("-").map((_, i) =>
        grid[y - i]?.[x - i] ?? "-"
      ).join("");
      // debug(`DiagonalNegYNegX ${diagonalNegYNegX}`)
      if (diagonalNegYNegX === word) count++;
    }
  }

  debug("Done.");
  answer(count);
};
