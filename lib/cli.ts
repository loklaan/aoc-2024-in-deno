import { Input as CliffyInput } from "@cliffy/prompt";
import * as Log from "@std/log";
import * as Color from "@std/fmt/colors";
import * as Datetime from "@std/datetime";

export class Input extends CliffyInput {
  protected override async complete(): Promise<string> {
    let input: string = this.getCurrentInputValue();

    if (!input.length) {
      const suggestion: string | undefined = this
        .suggestions[this.suggestionsIndex]?.toString();
      if (this.settings.complete) {
        input = await Promise.resolve(
          this.settings.complete(
            input,
            suggestion,
          ),
        );
      } else if (suggestion) {
        input = suggestion;
      }
      return input;
    }

    return super.complete();
  }
}

export function setupLogger(debug?: boolean) {
  const level = debug ? "DEBUG" : "INFO";
  Log.setup({
    handlers: {
      console: new Log.ConsoleHandler(level, {
        formatter: (record) =>
          `${
            Color.dim(
              `${
                Datetime.format(record.datetime, "hh:mma ss's'.SSS'ms'")
              } [${record.levelName}]`,
            )
          } ${record.msg}`,
      }),
    },
    loggers: {
      "default": {
        level,
        handlers: ["console"],
      },
    },
  });

  const logger = Log.getLogger();
  if (level !== "INFO") {
    logger.info(`Logger initialised with level ${level}`);
  }

  return logger;
}

export class BoxFormatter {
  private i = 0;

  altPipe() {
    return this.i++ % 3 === 0 ? "╣" : "│";
  }

  top(heading: string, nestedHeading: string) {
    const nestedHeadings = nestedHeading.split("\n").map((line, i, all) =>
      (all.length > 1 && i < all.length - 1
        ? `${this.altPipe()} ├─• `
        : `${this.altPipe()} ╰─• `) + line
    );
    return Color.dim(`
╭─┬─ ${heading} ───────────────────────╼
${nestedHeadings.join("\n")}
${this.altPipe()}`.trim());
  }

  body(str: string) {
    return str.split("\n").map((line) => `${Color.dim(this.altPipe())} ${line}`)
      .join("\n");
  }

  bottom(heading: string, footer: string) {
    const nestedFooter = footer.split("\n").map((line, i, all) =>
      ((all.length === 1 || all.length > 1 && i < all.length - 1)
        ? `${this.altPipe()} ╭─• `
        : `${this.altPipe()} ├─• `) + line
    );
    return `
${Color.dim(this.altPipe())}
${(nestedFooter.map((l) => Color.dim(l)).join("\n"))}
${Color.dim(`╰─┴──${"─".repeat(heading.length)}────────────────────────╼`)}`
      .trim();
  }
}

export type SolutionActions = {
  loadInput: () => Promise<string>;
  debug: (input: string | number | Record<string, unknown> | unknown[]) => void;
  answer: (value: string | number) => void;
};

export type Solution = (actions: SolutionActions) => Promise<void>;
