import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): number[] {
  return input[0].split(" ").map(Number);
}

function blink(numbers: number[], steps: number): number {
  return numbers.reduce((acc, number) => acc + blinkOnce(number, steps), 0);
}

const cache = new Map<string, number>();

function blinkOnce(number: number, steps: number): number {
  const key = `${number}-${steps}`;

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  if (steps === 0) {
    const result = 1;
    cache.set(key, result);

    return result;
  }

  if (number === 0) {
    const result = blinkOnce(1, steps - 1);

    cache.set(key, result);
    return result;
  }

  const stringNumber = number.toString();

  if (stringNumber.length % 2 === 0) {
    const half = stringNumber.length / 2;
    const firstHalf = Number(stringNumber.slice(0, half));
    const secondHalf = Number(stringNumber.slice(half, stringNumber.length));

    const result =
      blinkOnce(firstHalf, steps - 1) + blinkOnce(secondHalf, steps - 1);
    cache.set(key, result);

    return result;
  }

  const result = blinkOnce(number * 2024, steps - 1);
  cache.set(key, result);

  return result;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const numbers = blink(parsedInput, 75);
console.log(numbers);
