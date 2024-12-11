import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): number[] {
  return input[0].split(" ").map(Number);
}

function blink(numbers: number[], steps: number): number[] {
  for (let i = 0; i < steps; i++) {
    numbers = blinkOnce(numbers);
    // console.log(numbers);
  }

  return numbers;
}

function blinkOnce(numbers: number[]): number[] {
  // Iterate over the numbers and apply changes based on the rules
  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];

    // If the value is 0, change it to 1
    if (number === 0) {
      numbers[i] = 1;
    }

    // If the number of digits is even, split it in half
    else if (number.toString().length % 2 === 0) {
      const stringNumber = number.toString();

      const half = stringNumber.length / 2;
      const firstHalf = Number(stringNumber.slice(0, half));
      const secondHalf = Number(stringNumber.slice(half, stringNumber.length));

      // Remove the original number and insert the two halves
      numbers.splice(i, 1, firstHalf, secondHalf);
      i++;
    }

    // Otherwise, multiply the number by 2024
    else {
      numbers[i] *= 2024;
    }
  }

  return numbers;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const numbers = blink(parsedInput, 25);
console.log(numbers.length);
