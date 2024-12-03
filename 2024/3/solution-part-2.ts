import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string {
  return input.join();
}

function parseInstructions(line: string): number[][] {
  let shouldMultiply = true;
  let multipliers: string[] = [];

  const regex = /mul\(\d{1,3},\d{1,3}\)/g;

  do {
    const matches = line.match(regex);
    if (!matches) {
      break;
    }

    // Based on the statement, we should alternate between adding new multipliers or skipping them
    if (shouldMultiply) {
      // Find the index of the first match
      const multiplyIndex = line.indexOf(matches[0]);

      // Find the index of the first "don't" multiply instruction
      const dontMultiplyIndex = line.indexOf("don't()");

      if (multiplyIndex < dontMultiplyIndex || dontMultiplyIndex === -1) {
        // Add the multipliers to the list
        multipliers = multipliers.concat(matches[0]);

        // Trim the line to remove the added multiplier
        line = line.slice(multiplyIndex + matches[0].length);
      } else {
        // We should skip this multiplier
        shouldMultiply = false;
        line = line.slice(multiplyIndex + "don't()".length);
      }
    } else {
      // Find the index of the first "enable multiplication" instruction
      const doMultiplyIndex = line.indexOf("do()");

      if (doMultiplyIndex < 0) {
        // There are no more multipliers to add
        break;
      }

      shouldMultiply = true;
      line = line.slice(doMultiplyIndex + "do()".length);
    }
  } while (true);

  return multipliers?.map(parseInstruction) || [];
}

function parseInstruction(instruction: string): number[] {
  const regex = /\d{1,3}/g;
  const matches = instruction.match(regex);

  return matches ? matches.map(Number) : [];
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const instructions = parseInstructions(parsedInput);
const result = instructions.reduce((acc, [a, b]) => acc + a * b, 0);
console.log(result);
