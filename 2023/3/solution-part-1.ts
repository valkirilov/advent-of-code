import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

function findValidNumbers(input: string[][]): number[] {
  const validNumbers: number[] = [];

  for (let y = 0; y < input.length; y++) {
    let number = '';
    let isValidNumber = false;

    for (let x = 0; x < input[y].length; x++) {
      // Check if the current char is number
      if (!isNaN(Number(input[y][x]))) {
        number = `${number}${input[y][x]}`;

        if (!isValidNumber && checkIfNumberIsValid(input, x, y)) {
          isValidNumber = true;
        }
      }

      // Check if the current char is not a number and terminate the number (if there is such)
      if (isNaN(Number(input[y][x])) && number !== '') {
        if (isValidNumber) {
          validNumbers.push(Number(number));
        }
        
        // Reset the state variables
        number = '';
        isValidNumber = false;
      }
    }

    // And finally, check if there is a number at the end of the line and terminate it
    if (number !== '' && isValidNumber) {
      validNumbers.push(Number(number));
    }
  }


  return validNumbers;
}

function checkIfNumberIsValid(input: string[][], x: number, y: number): boolean {
  return isPositionValid(input, x-1, y-1) || 
  isPositionValid(input, x, y-1) || 
  isPositionValid(input, x+1, y-1) || 
  isPositionValid(input, x-1, y) || 
  isPositionValid(input, x+1, y) || 
  isPositionValid(input, x-1, y+1) || 
  isPositionValid(input, x, y+1) || 
  isPositionValid(input, x+1, y+1) 
}

function isPositionValid(input: string[][], x: number, y: number): boolean {
  // Check if the position is out of bounds
  if (y < 0 || y >= input.length || x < 0 || x >= input[y].length) {
    return false;
  }

  if (input[y][x] === '.') {
    return false;
  }

  if (!isNaN(Number(input[y][x]))) {
    return false;
  }

  return true;
}

function calculateSolution(validNumbers: number[]): number {
  return validNumbers.reduce((acc, curr) => acc + curr, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const validNumbers = findValidNumbers(parsedInput);
const solution = calculateSolution(validNumbers);


console.log(solution);