import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

function findGearRatios(input: string[][]): number[] {
  const gearRatios: number[] = [];
  
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === '*') {
        const adjacentNumbers = findAdjacentNumbers(input, x, y);

        if (adjacentNumbers.length > 1) {
          gearRatios.push(adjacentNumbers[0] * adjacentNumbers[1])
        }
      }
    }
  }

  return gearRatios;
}

function findAdjacentNumbers(input: string[][], x: number, y: number): number[] {
  const adjacentNumbers: number[] = [];

  for (let i=y-1; i<=y+1; i++) {
    for (let j=x-1; j<=x+1; j++) {
      // Skip the current position
      if (i === y && j === x) {
        continue;
      }

      // Check if the position contains a number
      if (!isNaN(Number(input[i][j]))) {
        const adjacentNumber = getAdjacentNumber(input, j, i);
        
        // Check if the number is not already in the list
        if (adjacentNumbers.includes(adjacentNumber)) {
          continue;
        }

        adjacentNumbers.push(adjacentNumber);
      }
    }
  }

  return adjacentNumbers;
}

function getAdjacentNumber(input: string[][], x: number, y: number): number {
  let number = input[y][x];

  // Go to the left until we find a separator
  for (let i=x-1; i>=0; i--) {
    if (isNaN(Number(input[y][i]))) {
      break;
    }

    number = `${input[y][i]}${number}`;
  }

  // Go to the right until we find a separator
  for (let i=x+1; i<input[y].length; i++) {
    if (isNaN(Number(input[y][i]))) {
      break;
    }

    number = `${number}${input[y][i]}`;
  }

  return Number(number);
}

function calculateSolution(validNumbers: number[]): number {
  return validNumbers.reduce((acc, curr) => acc + curr, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const gearRatios = findGearRatios(parsedInput);
const solution = calculateSolution(gearRatios);

console.log(solution);