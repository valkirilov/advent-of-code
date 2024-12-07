import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Equation {
  result: number;
  values: number[];
}

function readInput(input: string[]): Equation[] {
  return input.map(readInputLine);
}

function readInputLine(input: string): Equation {
  const [result, equation] = input.split(": ");
  const values = equation.split(" ").map((value) => parseInt(value));

  return {
    result: parseInt(result),
    values,
  };
}

function findValidEquations(equations: Equation[]): Equation[] {
  return equations.filter(isEquationValid);
}

function isEquationValid(equation: Equation): boolean {
  const { result, values } = equation;

  const operations = ["+", "*", "||"];
  const operationsCount = values.length - 1;

  for (let i = 0; i < 3 ** operationsCount; i++) {
    const operation = i.toString(3).padStart(operationsCount, "0");

    const equation = [];
    for (let j = 0; j < values.length; j++) {
      equation.push(values[j]);

      if (j < operationsCount) {
        equation.push(operations[parseInt(operation[j])]);
      }
    }

    if (computeEquation(equation) === result) {
      return true;
    }
  }

  return false;
}

function computeEquation(input: (string | number)[]): number {
  let result = 0;
  let currentOperation;

  while (input.length > 0) {
    const value = input.shift();

    if (typeof value === "string") {
      currentOperation = value;
    } else if (typeof value === "number") {
      if (currentOperation === "+") {
        result += value;
      } else if (currentOperation === "*") {
        result *= value;
      } else if (currentOperation === "||") {
        result = parseInt(`${result}${value}`);
      } else {
        result = value;
      }
    }
  }

  return result;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const validEquations = findValidEquations(parsedInput);
const result = validEquations.reduce(
  (acc, equation) => acc + equation.result,
  0,
);
console.log(result);
