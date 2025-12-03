import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): number[][] {
  return input.map(parseInput);
}

function parseInput(input: string): number[] {
  return input.trim().split("").map(Number);
}

function findMaxJoltage(batteries: number[][]): number {
  return batteries.reduce((max, battery) => {
    max += findMaxJoltageBattery(battery);

    return max;
  }, 0);
}

function findMaxJoltageBattery(battery: number[]): number {
  let maxJoltage = 0;

  for (let i = 0; i < battery.length - 1; i++) {
    for (let j = i + 1; j < battery.length; j++) {
      const joltage = Number(`${battery[i]}${battery[j]}`);
      if (joltage > maxJoltage) {
        maxJoltage = joltage;
      }
    }
  }

  return maxJoltage;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const maxJoltage = findMaxJoltage(parsedInput);
console.log(maxJoltage);
