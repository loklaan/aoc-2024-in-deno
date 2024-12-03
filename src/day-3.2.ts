import { Solution } from "@/lib/cli.ts";

type Instruction = {
  type: "multiply";
  a: number;
  b: number;
};
type Condition = {
  type: "do" | "dont";
  instructions: Instruction[];
};

const condDontRegExp = /don't\(\)/;
const condDoRegExp = /do\(\)/;
const mulRegExp = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  // NOTE: The input has multiple lines but it's meant to be parsed as a single line.
  //       This is not explicitly stated in the problem description.
  const lines = [
    input.split("\n").map((l) => l.trim()).filter((x) => x).join(""),
  ];

  const instructions = lines.flatMap((line) => {
    let conditions: Condition[] = [];
    let leftDonts: string[] = line.split(condDontRegExp);
    const firstDo = leftDonts.shift();

    debug(`DO first ones: ${firstDo}`);
    if (firstDo) {
      const firstDoInstuctions = extractMultiplyInstructions(firstDo);
      if (firstDoInstuctions.length) {
        debug(`  First`);
        debug(`    DO Instructs: ${JSON.stringify(firstDoInstuctions)}`);
        conditions.push({ type: "do", instructions: firstDoInstuctions });
      }
    }

    debug(`Left DONTS: ${leftDonts.length}`);
    while (leftDonts.length) {
      const dontAndMaybeDo = leftDonts.shift();
      debug(`DONT and Maybe DO: ${dontAndMaybeDo}`);
      if (dontAndMaybeDo) {
        const [dontStr, ...doStrs] = dontAndMaybeDo.split(condDoRegExp);
        debug(`  DONT: ${dontStr}`);
        const dontInstructions = extractMultiplyInstructions(dontStr);
        if (dontInstructions.length) {
          debug(`    DONT Instructs: ${JSON.stringify(dontInstructions)}`);
          conditions.push({ type: "dont", instructions: dontInstructions });
        }

        debug(`  DO: ${doStrs.join("  |  ")}`);
        for (const doStr of doStrs) {
          const doInstructions = extractMultiplyInstructions(doStr);
          if (doInstructions.length) {
            debug(`    DO Instructs: ${JSON.stringify(doInstructions)}`);
            conditions.push({ type: "do", instructions: doInstructions });
          }
        }
      }
    }

    debug(`Conditions: ${conditions.length}`);
    const doConditions = conditions.filter(({ type }) => type === "do");
    debug(`DO Conditions: ${doConditions.length}`);
    const doInstructions = doConditions.flatMap(({ instructions }) =>
      instructions
    );
    debug(`DO Instructs: ${doInstructions.length}`);

    return doInstructions;
  });

  const total = instructions.reduce((acc, instruction) => {
    switch (instruction.type) {
      case "multiply":
        debug(
          `acc ${acc}: + ${instruction.a} * ${instruction.b} (=${
            instruction.a * instruction.b
          })`,
        );
        return acc + instruction.a * instruction.b;
    }
    return acc;
  }, 0);

  debug("Done.");
  answer(total);
};

function extractMultiplyInstructions(line: string) {
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
}
