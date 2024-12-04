import { Solution } from "@/lib/cli.ts";

const word = "MAS";

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

      const diagonalTopLeftToBottomRight = `${grid[y - 1]?.[x - 1] ?? "-"}${
        grid[y][x]
      }${grid[y + 1]?.[x + 1] ?? "-"}`;
      debug(`diagonalTopLeftToBottomRight ${diagonalTopLeftToBottomRight}`);
      const diagonalBottomLeftToTopRight = `${grid[y + 1]?.[x - 1] ?? "-"}${
        grid[y][x]
      }${grid[y - 1]?.[x + 1] ?? "-"}`;
      debug(`diagonalBottomLeftToTopRight ${diagonalBottomLeftToTopRight}`);
      if (
        diagonalTopLeftToBottomRight === word &&
        diagonalBottomLeftToTopRight === word
      ) count++;
      if (
        diagonalTopLeftToBottomRight === word &&
        diagonalBottomLeftToTopRight.split("").reverse().join("") === word
      ) count++;
      if (
        diagonalTopLeftToBottomRight.split("").reverse().join("") === word &&
        diagonalBottomLeftToTopRight.split("").reverse().join("") === word
      ) count++;
      if (
        diagonalTopLeftToBottomRight.split("").reverse().join("") === word &&
        diagonalBottomLeftToTopRight === word
      ) count++;
    }
  }

  debug("Done.");
  answer(count);
};
