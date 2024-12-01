import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): { left: number[]; right: number[] } {
  return input.map(readInputLine).reduce(
    (acc, { left, right }) => {
      acc.left.push(left);
      acc.right.push(right);

      return acc;
    },
    { left: [], right: [] } as { left: number[]; right: number[] },
  );
}

function readInputLine(line: string): { left: number; right: number } {
  const [left, right] = line.split("   ").map(Number);

  return { left, right };
}

function findDistances(left: number[], right: number[]): number[] {
  return left.map((left, i) => Math.abs(left - right[i]));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { left, right } = readInput(inputLines);

left.sort();
right.sort();

const distances = findDistances(left, right);
const sum = distances.reduce((a, b) => a + b, 0);

console.log(sum);
