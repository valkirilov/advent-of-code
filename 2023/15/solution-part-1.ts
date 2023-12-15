import * as fs from "fs";
import * as _ from "lodash";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input;

function readInput(input: string): string[] {
  return input.split(",");
}

function calculateChecksum(input: string[]): number {
  const hashCodes = input.map(hash);

  return _.sum(hashCodes);
}

function hash(input: string): number {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const asciiCode = input.charCodeAt(i);
    hash += asciiCode;
    hash *= 17;
    hash %= 256;
  }

  return hash;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const checksum = calculateChecksum(parsedInput);

console.log(checksum);
