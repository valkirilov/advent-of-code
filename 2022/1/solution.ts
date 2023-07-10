import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";

const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): Array<number[]> {
  const elves: Array<number[]> = [];
  let currentElf: number[] = [];

  input.forEach((line) => {
    if (line === "") {
      elves.push(currentElf);
      currentElf = [];
    } else {
      currentElf.push(parseInt(line));
    }
  });

  elves.push(currentElf);

  return elves;
}

function calculateElvesCapacity(elves: Array<number[]>) {
  return elves.map(calculateElfCapacity).sort((a, b) => b - a);
}

function calculateElfCapacity(elf: number[]): number {
  return elf.reduce((a, b) => a + b, 0);
}

function findMaxElfCapacity(elvesCapacity: number[]): number {
  return Math.max(...elvesCapacity);
}

function findTop3ElvesCapacity(elvesCapacity: number[]): number {
  const sortedElvesCapacity = elvesCapacity.sort((a, b) => b - a);
  const top3ElvesCapacity = sortedElvesCapacity.slice(0, 3);
  const top3ElvesTotalCapacity = top3ElvesCapacity.reduce((a, b) => a + b, 0);

  return top3ElvesTotalCapacity;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const elves = readInput(inputLines);
const elvesCapacity = calculateElvesCapacity(elves);

// Part 1
const maxElfCapacity = findMaxElfCapacity(elvesCapacity);
console.log("Max Elf Capacity: %s", maxElfCapacity);

// Part 2
const top3ElvesCapacity = findTop3ElvesCapacity(elvesCapacity);
console.log("Top 3 Elves Capacity: %s", top3ElvesCapacity);
