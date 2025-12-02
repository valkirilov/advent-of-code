import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): [number, number][] {
  const joined = input.join("");
  const ranges = joined.split(",").filter((s) => s.trim());

  return ranges.map(parseInput);
}

function parseInput(input: string): [number, number] {
  const [start, end] = input.trim().split("-").map(Number);
  return [start, end];
}

function findInvalidNumbersSum(ranges: [number, number][]): number {
  let invalidNumbersSum: number = 0;

  ranges.forEach(([start, end]) => {
    invalidNumbersSum += findInvalidNumbersSumInRange(start, end);
  });

  return invalidNumbersSum;
}

function findInvalidNumbersSumInRange(start: number, end: number): number {
  let invalidNumbersSum = 0;

  for (let num = start; num <= end; num++) {
    if (!isValidNumber(num)) {
      invalidNumbersSum += num;
    }
  }

  return invalidNumbersSum;
}

function isValidNumber(number: number): boolean {
  const numberAsString = number.toString();

  for (
    let patternLength = 1;
    patternLength <= numberAsString.length / 2;
    patternLength++
  ) {
    if (numberAsString.length % patternLength !== 0) {
      continue;
    }

    const pattern = numberAsString.slice(0, patternLength);
    const repetitions = numberAsString.length / patternLength;

    // Check if repeating the pattern creates the entire number
    const repeated = pattern.repeat(repetitions);
    if (repeated === numberAsString) {
      return false;
    }
  }

  return true;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const invalidNumbersSum = findInvalidNumbersSum(parsedInput);
console.log(invalidNumbersSum);
