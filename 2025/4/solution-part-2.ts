import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Field {
  Empty = ".",
  Paper = "@",
}

function readInput(input: string[]): Field[][] {
  return input.map(parseLine);
}

function parseLine(line: string): Field[] {
  return line.split("").map((char) => char as Field);
}

function printMap(map: Field[][]): void {
  for (const row of map) {
    console.log(row.join(""));
  }
}

function findLiftablePaperCount(map: Field[][]): number {
  let totalCount = 0;

  const numRows = map.length;
  const numCols = map[0].length;

  let liftablePaperCount = 0;
  let positionsToRemove: [number, number][] = [];

  do {
    liftablePaperCount = 0;
    positionsToRemove = [];

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (map[r][c] === Field.Paper && isPaperLiftable(map, r, c)) {
          positionsToRemove.push([r, c]);
        }
      }
    }

    map = removePaper(map, positionsToRemove);

    liftablePaperCount = positionsToRemove.length;
    totalCount += liftablePaperCount;
  } while (liftablePaperCount > 0);

  return totalCount;
}

function removePaper(map: Field[][], positions: [number, number][]): Field[][] {
  const newMap = map.map((row) => row.slice());

  for (const [row, col] of positions) {
    newMap[row][col] = Field.Empty;
  }

  return newMap;
}

function isPaperLiftable(map: Field[][], row: number, col: number): boolean {
  let adjacentPapers = 0;

  const directions = [
    [-1, -1], // Up-Left
    [-1, 0], // Up
    [-1, 1], // Up-Right
    [0, -1], // Left
    [0, 1], // Right
    [1, -1], // Down-Left
    [1, 0], // Down
    [1, 1], // Down-Right
  ];

  for (const [dr, dc] of directions) {
    const field = map[row + dr]?.[col + dc];
    if (field === Field.Paper) {
      adjacentPapers++;
    }
  }

  return adjacentPapers < 4;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const liftablePaperCount = findLiftablePaperCount(parsedInput);
console.log(liftablePaperCount);
