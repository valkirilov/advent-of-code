import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): {
  sizes: [number, number][];
  requirements: number[][];
} {
  const sizes: [number, number][] = [];
  const requirements: number[][] = [];

  for (const line of input) {
    if (line.indexOf("x") === -1) {
      continue;
    }

    const [size, requirement] = line.split(": ");
    const [width, height] = size.split("x").map(Number);
    sizes.push([width, height]);

    const numbers = requirement.trim().split(" ").map(Number);
    requirements.push(numbers);
  }

  return { sizes, requirements };
}

function solveDummy(
  sizes: [number, number][],
  requirements: number[][],
): number {
  return sizes.reduce((count, [width, height], index) => {
    const availableSpaces = Math.floor(width / 3) * Math.floor(height / 3);
    const presentsNeeded = requirements[index].reduce((a, b) => a + b, 0);

    return count + (availableSpaces >= presentsNeeded ? 1 : 0);
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { sizes, requirements } = readInput(inputLines);
const result = solveDummy(sizes, requirements);
console.log(result);
