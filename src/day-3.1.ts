import { Solution } from "@/lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const lines = input.split("\n").map((l) => l.trim()).filter((x) => x);
  type Instruction = {
    type: "multiply";
    a: number;
    b: number;
  };
  const mulRegExp = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;
  const instructions = lines.flatMap((line) => {
    return Array.from(
      line.matchAll(mulRegExp).map((allResults) => {
        const instruction: Instruction = { type: "multiply", a: -1, b: -1 };
        for (let i = 0; i < allResults.length; i++) {
          switch (i) {
            case 0:
              break;
            case 1:
              instruction.a = parseInt(allResults[i]);
              break;
            case 2:
              instruction.b = parseInt(allResults[i]);
              break;
          }
        }
        return instruction;
      }),
    ).filter((x) => !!x);
  });

  const total = instructions.reduce((acc, instruction) => {
    switch (instruction.type) {
      case "multiply":
        return acc + instruction.a * instruction.b;
    }
    return acc;
  }, 0);

  debug("Done.");
  answer(total);
};
