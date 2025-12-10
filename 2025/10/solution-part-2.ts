import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(
  input: string[],
): { indicators: string[]; buttons: number[]; joltage: number[] }[] {
  return input.map(parseInput);
}

function parseInput(input: string): {
  indicators: string[];
  buttons: number[];
  joltage: number[];
} {
  const data = input.split(" ");

  const indicators: string[] = [];
  const buttons: number[] = [];
  const joltage: number[] = [];

  for (const item of data) {
    if (item.startsWith("[")) {
      indicators.push(...item.slice(1, -1).split(""));
    } else if (item.startsWith("(")) {
      buttons.push(...item.slice(1, -1).split(",").map(Number));
    } else if (item.startsWith("{")) {
      joltage.push(...item.slice(1, -1).split(",").map(Number));
    }
  }

  return { indicators, buttons, joltage };
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
console.log(parsedInput);
