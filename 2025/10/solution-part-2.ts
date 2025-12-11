import * as fs from "fs";
const solver = require("javascript-lp-solver");

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(
  input: string[],
): { indicators: string[]; buttons: number[][]; joltage: number[] }[] {
  return input.map(parseInput);
}

function parseInput(input: string): {
  indicators: string[];
  buttons: number[][];
  joltage: number[];
} {
  const data = input.split(" ");
  const indicators: string[] = [];
  const buttons: number[][] = [];
  const joltage: number[] = [];

  for (const item of data) {
    if (item.startsWith("[")) {
      indicators.push(...item.slice(1, -1).split(""));
    } else if (item.startsWith("(")) {
      buttons.push(item.slice(1, -1).split(",").map(Number));
    } else if (item.startsWith("{")) {
      joltage.push(...item.slice(1, -1).split(",").map(Number));
    }
  }

  return { indicators, buttons, joltage };
}

function transformButtons(
  input: {
    indicators: string[];
    buttons: number[][];
    joltage: number[];
  }[],
): number[][][] {
  return input.map(({ buttons, joltage }) =>
    buttons.map((button) => transformButtonToCounters(button, joltage.length)),
  );
}

function transformButtonToCounters(button: number[], length: number): number[] {
  const counters = createBlankCounters(length);

  for (const counter of button) {
    counters[counter]++;
  }

  return counters;
}

function createBlankCounters(length: number): number[] {
  return Array.from({ length }, () => 0);
}

function createMatrixes(
  transformedButtons: number[][][],
  joltage: number[][],
): number[][][] {
  return joltage.map((joltage, index) =>
    createMatrix(transformedButtons[index], joltage),
  );
}

function createMatrix(
  transformedButtons: number[][],
  joltage: number[],
): number[][] {
  const numCounters = joltage.length;
  const numButtons = transformedButtons.length;
  const matrix: number[][] = [];

  for (let counterIndex = 0; counterIndex < numCounters; counterIndex++) {
    const row: number[] = [];
    for (let buttonIndex = 0; buttonIndex < numButtons; buttonIndex++) {
      row.push(transformedButtons[buttonIndex][counterIndex] || 0);
    }
    // row.push(joltage[counterIndex]);
    matrix.push(row);
  }

  return matrix;
}

function printMatrix(matrix: number[][]): void {
  for (const row of matrix) {
    console.log(row.join(" "));
  }
}

function countMinConfigurations(
  input: {
    indicators: string[];
    buttons: number[][];
    joltage: number[];
  }[],
  transformedButtons: number[][][],
): number {
  return input.reduce((acc, { joltage }, index) => {
    const minPresses = solveWithLPSolver(transformedButtons[index], joltage);

    return acc + (minPresses === Infinity ? 0 : minPresses);
  }, 0);
}

function solveWithLPSolver(buttons: number[][], target: number[]): number {
  const model: any = {
    optimize: "cost",
    opType: "min",
    constraints: {},
    variables: {},
    ints: {},
  };

  // Create variables for each button (x0, x1, x2, ...)
  for (let j = 0; j < buttons.length; j++) {
    const varName = `x${j}`;
    model.variables[varName] = { cost: 1 };
    model.ints[varName] = 1;
  }

  // Create constraints for each counter
  for (let i = 0; i < target.length; i++) {
    const constraintName = `counter${i}`;
    model.constraints[constraintName] = { equal: target[i] };

    // Add coefficients for this constraint
    for (let j = 0; j < buttons.length; j++) {
      const varName = `x${j}`;
      if (!model.variables[varName][constraintName]) {
        model.variables[varName][constraintName] = 0;
      }

      model.variables[varName][constraintName] = buttons[j][i];
    }
  }

  const results = solver.Solve(model);

  if (!results.feasible) {
    return Infinity;
  }

  // Extract solution
  const solution: number[] = [];
  let totalCost = 0;
  for (let j = 0; j < buttons.length; j++) {
    const varName = `x${j}`;
    const value = results[varName] || 0;
    solution.push(value);
    totalCost += value;
  }

  return totalCost;
}

// Enough helpers, let's solve the problem
// ----------------------------------------
const parsedInput = readInput(inputLines);
const transformedButtons = transformButtons(parsedInput);

const result = countMinConfigurations(parsedInput, transformedButtons);
console.log(result);
