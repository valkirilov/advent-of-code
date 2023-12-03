import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function findLineCodes(input: string[]): number[] {
  return input.map(findLineCode);
}

function findLineCode(line: string): number {
  let firstDigit, lastDigit;

  // Go through the line characters and find the first and last digit
  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char >= "0" && char <= "9") {
      if (!firstDigit) {
        firstDigit = char;
      }

      lastDigit = char;
    }
  }

  return parseInt(`${firstDigit}${lastDigit}`);
}

function calculateSum(lineCodes: number[]): number {
  return lineCodes.reduce((a, b) => a + b, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const lineCodes = findLineCodes(inputLines);
const sum = calculateSum(lineCodes);

console.log(sum);
