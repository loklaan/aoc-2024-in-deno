import { Solution } from "@/lib/cli.ts";

export const solution: Solution = async ({ loadInput, debug, answer }) => {
  debug(`Start.`);
  const input = await loadInput();
  const reports = input.split("\n").filter(
    (x) => x,
  ).map((line) => line.split(" ").map((level) => parseInt(level)));

  const analyzedReports = reports.map((report): Check => {
    const fullCheck = safetyCheck(report);
    debug(
      `‣${fullCheck.isSafe ? "  [SAFE] " : "[UNSAFE] "}   ${report.join(" ")}`,
      "spoiler-free",
    );

    let dampenedCheck: Check | undefined = undefined;
    if (!fullCheck.isSafe) {
      for (let index = 0; index < report.length; index++) {
        const leakyReport = report.filter((_, indexToRemove) =>
          indexToRemove !== index
        );

        // Slice the index out of the array
        const backupCheck = safetyCheck(leakyReport);
        debug(
          `  ‣${backupCheck.isSafe ? "  [SAFE] " : "[UNSAFE] "} ${
            leakyReport.join(" ")
          }`,
          "spoiler-free",
        );
        if (backupCheck.isSafe) {
          dampenedCheck = backupCheck;
          debug("  Exiting damped checks.");
          break;
        }
      }
    }
    return dampenedCheck ?? fullCheck;
  });

  const count = analyzedReports.filter((report) => report.isSafe).length;

  debug("Done.");
  answer(count);
};

type Check = {
  direction: number;
  isSafe: boolean;
  report: number[];
};

function safetyCheck(report: number[]): Check {
  return report.reduce((accum: Check, level, index, allLevels) => {
    if (index !== 0) {
      if (!accum.isSafe) return accum;
      const diff = Math.abs(level - allLevels[index - 1]);
      if (diff === 0 || diff > 3) {
        accum.isSafe = false;
      } else {
        let newDirection: number;
        if (level > allLevels[index - 1]) {
          newDirection = 1;
        } else {
          newDirection = -1;
        }

        if (accum.direction === 0) {
          accum.direction = newDirection;
        } else if (accum.direction !== newDirection) {
          accum.isSafe = false;
        }
      }
    }

    return accum;
  }, { direction: 0, isSafe: true, report } satisfies Check);
}
