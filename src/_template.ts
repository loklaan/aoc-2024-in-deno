import { Solution } from "@/lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const lines = input.split("\n").map((l) => l.trim()).filter((x) => x);

  debug("Done.");
  answer("");
};
