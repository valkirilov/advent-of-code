import * as exp from "constants";
import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Operation {
  Add = "+",
  Multiply = "*",
}

interface Expression {
  numbers: number[];
  operation: Operation;
}

function readInput(input: string[]): {
  matrixNumbers: string[][];
  operations: Operation[];
} {
  const matrixNumbers: string[][] = [];
  const operations: Operation[] = [];

  input.forEach((inputLine, index) => {
    if (index === input.length - 1) {
      const operationsInput = inputLine.trim().split(" ").filter(Boolean);

      for (let i = 0; i < operationsInput.length; i++) {
        operations.push(operationsInput[i] as Operation);
      }
    } else {
      matrixNumbers[index] = [];

      for (let i = 0; i < inputLine.length; i++) {
        matrixNumbers[index][i] = inputLine[i];
      }
    }
  });

  return { matrixNumbers, operations };
}

function parseExpressions(
  input: string[][],
  operations: Operation[],
): Expression[] {
  const expressions: Expression[] = [];

  operations.forEach((operation, index) => {
    expressions.push({
      operation,
      numbers: [],
    });
  });

  const numbers: string[] = [];
  for (let row = 0; row < input.length; row++) {
    for (let col = input[row].length - 1; col >= 0; col--) {
      const char = input[row][col];

      if (row === 0) {
        numbers[col] = char;
      } else {
        if (char !== " ") {
          numbers[col] = `${numbers[col]}${char}`;
        }
      }
    }
  }

  let numberIndex = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== " ") {
      expressions[numberIndex].numbers.push(Number(numbers[i]));
    } else {
      numberIndex++;
    }
  }

  return expressions;
}

function sumExpressions(expressions: Expression[]): number {
  return expressions.reduce((sum, expression) => {
    sum += evaluateExpression(expression);
    return sum;
  }, 0);
}

function evaluateExpression(expression: Expression): number {
  switch (expression.operation) {
    case Operation.Add:
      return expression.numbers?.reduce((acc, num) => acc + num, 0)!;
    case Operation.Multiply:
      return expression.numbers?.reduce((acc, num) => acc * num, 1)!;
    default:
      throw new Error("Unknown operation");
  }
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { matrixNumbers, operations } = readInput(inputLines);
const expressions = parseExpressions(matrixNumbers, operations);
const sum = sumExpressions(expressions);

console.log(sum);
