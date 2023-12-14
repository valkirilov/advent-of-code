import * as fs from "fs";
import * as _ from "lodash";
import { it } from "node:test";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const ITERATIONS = 1000000000;

enum FieldType {
  RoundedRock = "O",
  CubeRock = "#",
  Empty = ".",
}

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

enum TiltDirection {
  North = "N",
}

function findCycle(field: string[][]) {
  const seen: Record<string, string[][]> = {};
  const cache: Array<string[][]> = [];

  let i = 0;

  // Let's keep the starting point
  seen[generateKey(field)] = field;
  cache.push(field);

  // Flip the field until we find a cycle
  while (true) {
    i++;

    // So, start with the tilt
    field = tiltField(field);

    // Check if we've seen this field before
    const key = generateKey(field);
    if (key in seen) {
      break;
    }

    // Otherwise, keep the field in the cache
    seen[key] = field;
    cache.push(field);
  }

  // Now, we identified the cycle, let's find the field where it starts
  const first = cache.findIndex((f) => generateKey(f) === generateKey(field));

  // Let's do the math
  const cycleLength = ITERATIONS - first;
  const loopLength = i - first;
  const cycleIndex = (cycleLength % loopLength) + first - 1;

  const result = cache[cycleIndex];

  return result;
}

function generateKey(field: string[][]): string {
  return field.map((row) => row.join("")).join("");
}

function tiltField(
  field: string[][],
  direction: TiltDirection = TiltDirection.North,
): string[][] {
  // Do the tilt 3 times, to move the rocks in all directions
  for (let i = 0; i < 4; i++) {
    // Flip the to move the rocks up
    field = rotateField(field);

    // Tilt the field to move the rocks left
    field = field.map(tiltFieldRow);

    // Reverse the flip, to prepare the field for the next tilt
    field = reverseField(field);
  }

  return field;
}

function rotateField(field: string[][]): string[][] {
  return _.zip(...field) as string[][];
}

function reverseField(field: string[][]): string[][] {
  return field.map((row) => row.reverse());
}

function tiltFieldRow(row: string[]): string[] {
  let emptyFields = [];

  for (let i = 0; i < row.length; i++) {
    const current = row[i];

    if (current === FieldType.Empty) {
      emptyFields.push(i);
    } else if (current === FieldType.CubeRock) {
      emptyFields = [];
    } else if (current === FieldType.RoundedRock) {
      if (emptyFields.length) {
        const emptyField = emptyFields.shift() as number;

        row[emptyField] = FieldType.RoundedRock;
        row[i] = FieldType.Empty;

        emptyFields.push(i);
      }
    }
  }

  return row;
}

function calculateFieldLoad(field: string[][]): number {
  const maxRowLoad = field[0].length;

  // One more flip to get the field back to be easer for calculations
  field = rotateField(field);

  return field.reduce((load: number | any, row: string[]) => {
    return row.reduce(
      (fieldLoad: number | any, field: string, index: number) => {
        if (field === FieldType.RoundedRock) {
          fieldLoad += maxRowLoad - index;
        }

        return fieldLoad;
      },
      load,
    );
  }, 0);
}

function printField(field: string[][]): void {
  field.forEach((line) => console.log(line.join("")));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const tiltedField = tiltField(parsedInput);
const cycle = findCycle(tiltedField);
const rocksLoad = calculateFieldLoad(cycle);

console.log("Rocks load:", rocksLoad);
