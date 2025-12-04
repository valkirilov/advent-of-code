import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string[] {
  return input.map((inputLine) => inputLine.trim());
}

function findMaxJoltage(batteries: string[]): number {
  return batteries.reduce((max, battery) => {
    max += maxSubsequence(battery);

    return max;
  }, 0);
}

function maxSubsequence(num: string, k = 12): number {
  const stack: string[] = [];
  const n = num.length;
  let toRemove = n - k;

  for (let i = 0; i < n; i++) {
    const digit = num[i];

    while (
      toRemove > 0 &&
      stack.length > 0 &&
      stack[stack.length - 1] < digit
    ) {
      stack.pop();
      toRemove--;
    }

    stack.push(digit);
  }

  // In case we didn't remove enough digits
  return Number(stack.slice(0, k).join(""));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const maxJoltage = findMaxJoltage(parsedInput);
console.log(maxJoltage);
