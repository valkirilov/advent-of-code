import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const START_SYMBOL = "X";
const VALID_SYMBOLS = ["X", "M", "A", "S"];

const foundWords = new Set<string>();

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

function findWords(input: string[][]): number {
  let words = 0;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === START_SYMBOL) {
        // Recursively search for the next letter in all 8 directions
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) {
              continue;
            }

            words += findWordsFromPosition(
              input,
              x,
              y,
              initVisited(input),
              0,
              dx,
              dy,
            );
          }
        }
      }
    }
  }

  return words;
}

function findWordsFromPosition(
  input: string[][],
  x: number,
  y: number,
  visited: boolean[][],
  currentLetterIndex: number,
  dX: number,
  dY: number,
): number {
  // Check if the current position is out of bounds
  if (!isPositionValid(input, x, y)) {
    return 0;
  }

  // Check if the current position is already visited
  if (visited[y][x]) {
    return 0;
  }

  // Check if the current position is not a valid symbol
  if (!VALID_SYMBOLS.includes(input[y][x])) {
    return 0;
  }

  // Check if the current position matches the letter we are looking for or stop the search
  if (input[y][x] !== VALID_SYMBOLS[currentLetterIndex]) {
    return 0;
  }

  // Check if we are at the last letter
  if (currentLetterIndex === VALID_SYMBOLS.length - 1) {
    visited = visited.map((line) => [...line]);
    visited[y][x] = true;
    globalVisited[y][x] = true;

    const hash = generateHash(visited);
    if (!foundWords.has(hash)) {
      // console.log("Found word that doesn't exist yet");
      foundWords.add(hash);

      // print(input, visited);

      return 1;
    }

    return 0;
  }

  // Mark the current position as visited, but copy the visited array to avoid side effects
  visited = visited.map((line) => [...line]);
  visited[y][x] = true;
  globalVisited[y][x] = true;

  let words = 0;
  // // Recursively search for the next letter in all 8 directions
  // for (let dy = -1; dy <= 1; dy++) {
  //   for (let dx = -1; dx <= 1; dx++) {
  //     if (dx === 0 && dy === 0) {
  //       continue;
  //     }

  //     words += findWordsFromPosition(
  //       input,
  //       x + dx,
  //       y + dy,
  //       visited,
  //       currentLetterIndex + 1,
  //     );
  //   }
  // }

  // Recursively search for the next letter in the same direction
  words += findWordsFromPosition(
    input,
    x + dX,
    y + dY,
    visited,
    currentLetterIndex + 1,
    dX,
    dY,
  );

  return words;
}

function isPositionValid(input: string[][], x: number, y: number): boolean {
  return y >= 0 && y < input.length && x >= 0 && x < input[y].length;
}

function initVisited(input: string[][]): boolean[][] {
  return input.map((line) => line.map(() => false));
}

// Replace the booleans with 1 and 0 and convert the 2D array to a string
function generateHash(input: boolean[][]): string {
  return input
    .map((line) => line.map((cell) => (cell ? "1" : "0")).join(""))
    .join("");
}
function print(input: string[][], visited: boolean[][]): void {
  console.log(
    visited
      .map((line, y) =>
        line.map((cell, x) => (cell ? input[y][x] : ".")).join(""),
      )
      .join("\n"),
  );
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const globalVisited = initVisited(parsedInput);
const words = findWords(parsedInput);
console.log(words);

// print(parsedInput, globalVisited);

// const test = findWordsFromPosition(
//   parsedInput,
//   4,
//   1,
//   initVisited(parsedInput),
//   0,
// );
// console.log(test);
