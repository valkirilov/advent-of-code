import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string {
  return input.join();
}

function parseInstructions(line: string): number[][] {
  const regex = /mul\(\d{1,3},\d{1,3}\)/g;
  const matches = line.match(regex);

  return matches?.map(parseInstruction) || [];
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
