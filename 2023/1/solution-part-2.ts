import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function findLineCodes(input: string[]): number[] {
  return input.map(findLineCode);
}

const DIGITS_MAPPING: Record<string, number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function findLineCode(line: string): number {
  let firstDigitIndex: number, lastDigitIndex: number;
  let firstDigit: string, lastDigit: string;

  // Find the indexes of the first and last digit
  Object.keys(DIGITS_MAPPING).forEach((digit) => {
    const firstOccurrenceIndex = line.indexOf(digit);
    const lastOccurrenceIndex = line.lastIndexOf(digit);

    if (firstDigitIndex === undefined && firstOccurrenceIndex !== -1) {
      firstDigitIndex = firstOccurrenceIndex;
      firstDigit = digit;

      lastDigitIndex = lastOccurrenceIndex;
      lastDigit = digit;
    }

    if (firstOccurrenceIndex !== -1 && firstOccurrenceIndex < firstDigitIndex) {
      firstDigitIndex = firstOccurrenceIndex;
      firstDigit = digit;
    }

    if (lastOccurrenceIndex !== -1 && lastOccurrenceIndex > lastDigitIndex) {
      lastDigitIndex = lastOccurrenceIndex;
      lastDigit = digit;
    }
  });

  const firstDigitNumber = DIGITS_MAPPING[firstDigit!];
  const lastDigitNumber = DIGITS_MAPPING[lastDigit!];

  return parseInt(`${firstDigitNumber}${lastDigitNumber}`);
}

function calculateSum(lineCodes: number[]): number {
  return lineCodes.reduce((a, b) => a + b, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const lineCodes = findLineCodes(inputLines);
const sum = calculateSum(lineCodes);

console.log(sum);
