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
  operation?: Operation;
}

function readInput(input: string[]): Expression[] {
  const expressions: Expression[] = [];

  input.forEach((inputLine, index) => {
    if (index === input.length - 1) {
      const operations = inputLine.trim().split(" ").filter(Boolean);

      for (let i = 0; i < operations.length; i++) {
        expressions[i].operation = operations[i] as Operation;
      }
    } else {
      const numbers = inputLine.trim().split(" ").filter(Boolean).map(Number);

      if (index === 0) {
        for (let i = 0; i < numbers.length; i++) {
          expressions.push({ numbers: [numbers[i]] });
        }
      } else {
        for (let i = 0; i < numbers.length; i++) {
          expressions[i].numbers.push(numbers[i]);
        }
      }
    }
  });

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
      return expression.numbers.reduce((acc, num) => acc + num, 0);
    case Operation.Multiply:
      return expression.numbers.reduce((acc, num) => acc * num, 1);
    default:
      throw new Error("Unknown operation");
  }
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const expressions = readInput(inputLines);
const sum = sumExpressions(expressions);

console.log(sum);
