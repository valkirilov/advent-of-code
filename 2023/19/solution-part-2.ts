import * as fs from "fs";
import * as _ from "lodash";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const PARTS_COMBINATION = 4000;

interface Instruction {
  name: string;
  conditions: Condition[];
}

interface Condition {
  formula?: {
    field: string;
    operator: string;
    value: number;
  };
  result: string | "A" | "R";
}

function readInput(input: string[]): {
  instructions: Record<string, Instruction>;
} {
  const instructions: Record<string, Instruction> = {};

  for (const line of input) {
    if (line === "") {
      break;
    }

    const instruction = parseInstruction(line);

    instructions[instruction.name] = instruction;
  }

  return {
    instructions,
  };
}

function parseInstruction(line: string): Instruction {
  // Remove the last bracket
  line = line.substring(0, line.length - 1);

  // Split the line into name and conditions
  const [name, conditionsString] = line.split("{");

  return {
    name,
    conditions: parseConditions(conditionsString),
  };
}

function parseConditions(line: string): Condition[] {
  // Split the line into conditions
  const conditions = line.split(",");

  return conditions.map(parseCondition);
}

function parseCondition(line: string): Condition {
  // Split the line into parts, formula and result
  const [formula, result] = line.split(":");

  if (!result) {
    return {
      result: formula,
    };
  }

  const field = formula[0];
  const operator = formula[1];
  const value = Number(formula.substring(2));

  return {
    formula: {
      field,
      operator,
      value,
    },
    result,
  };
}

function evaluateParts(
  parts: Part[],
  instructions: Record<string, Instruction>,
): Part[] {
  const results: Part[] = [];

  for (const part of parts) {
    if (evaluatePart(part, instructions)) {
      results.push(part);
    }
  }

  return results;
}

function evaluatePart(
  part: Part,
  instructions: Record<string, Instruction>,
): boolean {
  let instruction = instructions["in"];

  while (true) {
    for (const condition of instruction.conditions) {
      const { formula, result } = condition;

      if (!formula) {
        if (result === "A") {
          return true;
        } else if (result === "R") {
          return false;
        }

        instruction = instructions[result];
        continue;
      }

      const equation = `${convertPartToFormula(part)};${formula}`;

      if (eval(equation)) {
        if (result === "A") {
          return true;
        } else if (result === "R") {
          return false;
        }

        instruction = instructions[condition.result];
        break;
      } else {
        // Move to the next condition
        continue;
      }
    }
  }
}

function convertPartToFormula(part: Part): string {
  return `const x=${part.x}; const m=${part.m}; const a=${part.a}; const s=${part.s}`;
}

interface Part {
  workflow: string;
  x: {
    min: number;
    max: number;
  };
  m: {
    min: number;
    max: number;
  };
  a: {
    min: number;
    max: number;
  };
  s: {
    min: number;
    max: number;
  };
}

function evaluatePossiblePartsCombinations(
  instructions: Record<string, Instruction>,
): number {
  const queue: Part[] = [getInitialPart()];
  const acceptedWorkflows: Part[] = [];

  while (queue.length > 0) {
    const part = queue.shift()!;
    const instruction = instructions[part.workflow];

    for (const condition of instruction.conditions) {
      const { formula, result } = condition;

      // If we reached the end of the workflow, we should add the next workflow to the queue
      if (!formula) {
        const nextPart = _.cloneDeep(part) as Part;

        if (result === "A") {
          acceptedWorkflows.push(nextPart);
          break;
        } else if (result === "R") {
          break;
        }

        nextPart.workflow = result;
        queue.push(nextPart);
      } else if (formula) {
        // If we have a formula, we should adapt the part to the condition
        const { field, operator, value } = formula;

        const trueNextPart = _.cloneDeep(part) as Part;
        trueNextPart.workflow = result;

        if (operator === "<") {
          trueNextPart[field as keyof Pick<Part, "x" | "m" | "a" | "s">].max =
            value - 1;

          part[field as keyof Pick<Part, "x" | "m" | "a" | "s">].min = value;
        } else if (operator === ">") {
          trueNextPart[field as keyof Pick<Part, "x" | "m" | "a" | "s">].min =
            value + 1;

          part[field as keyof Pick<Part, "x" | "m" | "a" | "s">].max = value;
        }

        if (result === "A") {
          acceptedWorkflows.push(trueNextPart);
        } else if (result !== "R") {
          queue.push(trueNextPart);

          part.workflow = result;
        }
      }
    }
  }

  // Now, we can calculate how many combinations are possible
  let possibleCombinations = 0;

  acceptedWorkflows.forEach((part) => {
    // For each part, we should calculate the number of possible combinations (one for each x, m, a, s)
    const x = part.x.max - part.x.min + 1;
    const m = part.m.max - part.m.min + 1;
    const a = part.a.max - part.a.min + 1;
    const s = part.s.max - part.s.min + 1;

    possibleCombinations += x * m * a * s;
  });

  return possibleCombinations;
}

function getInitialPart(): Part {
  return {
    workflow: "in",
    x: {
      min: 1,
      max: PARTS_COMBINATION,
    },
    m: {
      min: 1,
      max: PARTS_COMBINATION,
    },
    a: {
      min: 1,
      max: PARTS_COMBINATION,
    },
    s: {
      min: 1,
      max: PARTS_COMBINATION,
    },
  };
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { instructions } = readInput(inputLines);
const sum = evaluatePossiblePartsCombinations(instructions);

console.log(sum);
