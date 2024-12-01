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

function calculateSimilarCount(left: number[], right: number[]): number[] {
  return left.map((left) => right.filter((right) => right === left).length);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { left, right } = readInput(inputLines);
const similarCount = calculateSimilarCount(left, right);
const similarityScore = left.map((left, index) => left * similarCount[index]);
const sum = similarityScore.reduce((a, b) => a + b, 0);

console.log(sum);
