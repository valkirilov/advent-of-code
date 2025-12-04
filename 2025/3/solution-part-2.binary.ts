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
    max += findMaxJoltageBattery(battery);

    return max;
  }, 0);
}

function findMaxJoltageBattery(battery: string): number {
  let maxJoltage = 0;

  const size = battery.length;
  const ones = 12; // Number of 1s in the bitmask

  // Use Gosper's hack with BigInt to iterate through all combinations with exactly 12 ones
  let mask = (1n << BigInt(ones)) - 1n; // Start with rightmost 12 ones
  const limit = 1n << BigInt(size); // Maximum value for size bits

  let count = 0;
  while (mask < limit) {
    const joltage = findSumJoltage(battery, mask);
    maxJoltage = Math.max(maxJoltage, joltage);
    count++;

    // Gosper's hack with BigInt: get next number with same number of 1 bits
    const c = mask & -mask;
    const r = mask + c;
    mask = (((r ^ mask) >> 2n) / c) | r;
  }

  console.log(`Checked ${count} permutations`);

  return maxJoltage;
}

function findSumJoltage(battery: string, mask: bigint): number {
  let sum = "";
  for (let i = 0; i < battery.length; i++) {
    // Check if bit at position i is set (reading from left to right in battery)
    if (mask & (1n << BigInt(battery.length - 1 - i))) {
      sum = `${sum}${battery[i]}`;
    }
  }

  return Number(sum);
}

function countOnes(n: number): number {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const maxJoltage = findMaxJoltage(parsedInput);
console.log(maxJoltage);
