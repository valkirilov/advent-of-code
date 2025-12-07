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

function findSplittersSum(matrix: Field[][]): number {
  let sum = 0;

  const start = findStart(matrix);
  if (!start) {
    throw new Error("Start position not found");
  }

  const beams = [start];

  while (beams.length > 0) {
    const beam = beams.shift()!;
    const currentRow = beam[0];
    const currentCol = beam[1];

    if (isPositionValid(matrix, currentRow + 1, currentCol, Field.Empty)) {
      matrix[currentRow + 1][currentCol] = Field.Beam;
      beams.push([currentRow + 1, currentCol]);
    } else if (
      isPositionValid(matrix, currentRow + 1, currentCol, Field.Splitter)
    ) {
      if (
        isPositionValid(matrix, currentRow + 1, currentCol - 1, Field.Empty)
      ) {
        matrix[currentRow + 1][currentCol - 1] = Field.Beam;
        beams.push([currentRow + 1, currentCol - 1]);
        sum++;
      }

      if (
        isPositionValid(matrix, currentRow + 1, currentCol + 1, Field.Empty)
      ) {
        matrix[currentRow + 1][currentCol + 1] = Field.Beam;
        beams.push([currentRow + 1, currentCol + 1]);
        sum++;
      }
    } else {
      sum--;
    }
  }

  return sum;
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
const sumSplitters = findSplittersSum(parsedInput);
console.log(sumSplitters + 1);
