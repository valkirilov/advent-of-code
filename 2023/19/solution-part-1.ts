import * as fs from "fs";
import { parse } from "path";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Instruction {
  name: string;
  conditions: Condition[];
}

interface Condition {
  formula?: string;
  result: string | "A" | "R";
}

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

function readInput(input: string[]): {
  instructions: Record<string, Instruction>;
  parts: Part[];
} {
  const instructions: Record<string, Instruction> = {};
  const parts: Part[] = [];

  let isInstruction = true;

  for (const line of input) {
    if (line === "") {
      isInstruction = false;
      continue;
    }

    if (isInstruction) {
      const instruction = parseInstruction(line);

      instructions[instruction.name] = instruction;
    } else {
      parts.push(parsePart(line));
    }
  }

  return {
    instructions,
    parts,
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

  return {
    formula,
    result,
  };
}

function parsePart(line: string): Part {
  // Remove the brackets at the start and end
  line = line.substring(1, line.length - 1);

  // Split the line into parts
  const parts = line.split(",");

  return parts.reduce((part, partString) => {
    // Split the part into key and value
    const [key, value] = partString.split("=");

    // Parse the value
    const parsedValue = parseInt(value);

    // Set the value
    part[key as keyof Part] = parsedValue;

    return part;
  }, {} as Part);
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

function calculateSum(parts: Part[]): number {
  return parts.reduce((sum, part) => {
    return sum + part.x + part.m + part.a + part.s;
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { instructions, parts } = readInput(inputLines);
const results = evaluateParts(parts, instructions);
const sum = calculateSum(results);

console.log(sum);
