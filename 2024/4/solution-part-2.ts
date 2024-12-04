import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const START_SYMBOL = "A";

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

function findWords(input: string[][]): number {
  let words = 0;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === START_SYMBOL) {
        if (
          isPositionValid(input, x - 1, y - 1, "M") &&
          isPositionValid(input, x + 1, y + 1, "S") &&
          isPositionValid(input, x - 1, y + 1, "M") &&
          isPositionValid(input, x + 1, y - 1, "S")
        ) {
          words++;
        }

        if (
          isPositionValid(input, x - 1, y - 1, "S") &&
          isPositionValid(input, x + 1, y + 1, "M") &&
          isPositionValid(input, x - 1, y + 1, "S") &&
          isPositionValid(input, x + 1, y - 1, "M")
        ) {
          words++;
        }

        if (
          isPositionValid(input, x - 1, y - 1, "M") &&
          isPositionValid(input, x + 1, y + 1, "S") &&
          isPositionValid(input, x - 1, y + 1, "S") &&
          isPositionValid(input, x + 1, y - 1, "M")
        ) {
          words++;
        }

        if (
          isPositionValid(input, x - 1, y - 1, "S") &&
          isPositionValid(input, x + 1, y + 1, "M") &&
          isPositionValid(input, x - 1, y + 1, "M") &&
          isPositionValid(input, x + 1, y - 1, "S")
        ) {
          words++;
        }
      }
    }
  }

  return words;
}

function isPositionValid(
  input: string[][],
  x: number,
  y: number,
  matcher: string,
): boolean {
  return (
    x >= 0 &&
    y >= 0 &&
    y < input.length &&
    x < input[y].length &&
    input[y][x] === matcher
  );
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const words = findWords(parsedInput);
console.log(words);
