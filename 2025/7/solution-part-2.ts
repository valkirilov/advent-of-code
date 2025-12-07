import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Field {
  Start = "S",
  Empty = ".",
  Splitter = "^",
  Beam = "|",
}

function readInput(input: string[]): Field[][] {
  return input.map((line) => line.split("").map((char) => char as Field));
}

function printMatrix(matrix: Field[][]): void {
  for (let row = 0; row < matrix.length; row++) {
    console.log(matrix[row].join(""));
  }
}

function findStart(matrix: Field[][]): [number, number] | null {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === Field.Start) {
        return [row, col];
      }
    }
  }

  return null;
}

function findBeamTimelines(
  matrix: Field[][],
  row: number,
  col: number,
  cache: Map<string, number> = new Map(),
): number {
  const key = `${row},${col}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const nextRow = row + 1;

  if (nextRow >= matrix.length) {
    return 1;
  }

  let result = 0;

  if (isPositionValid(matrix, nextRow, col, Field.Empty)) {
    result = findBeamTimelines(matrix, nextRow, col, cache);
  } else if (isPositionValid(matrix, nextRow, col, Field.Splitter)) {
    if (isPositionValid(matrix, nextRow, col - 1, Field.Empty)) {
      result += findBeamTimelines(matrix, nextRow, col - 1, cache);
    }

    if (isPositionValid(matrix, nextRow, col + 1, Field.Empty)) {
      result += findBeamTimelines(matrix, nextRow, col + 1, cache);
    }
  } else {
    result = 0;
  }

  cache.set(key, result);

  return result;
}

function isPositionValid(
  matrix: Field[][],
  row: number,
  col: number,
  matcher: Field,
): boolean {
  // Check bounds
  if (row < 0 || row >= matrix.length || col < 0 || col >= matrix[0].length) {
    return false;
  }

  // Check if the position matches the given field
  if (matrix[row][col] === matcher) {
    return true;
  }

  return false;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const start = findStart(parsedInput)!;
const sumTimelines = findBeamTimelines(parsedInput, start[0], start[1]);

console.log(sumTimelines);
