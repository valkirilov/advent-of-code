import * as fs from "fs";
import * as _ from "lodash";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input;

enum Operation {
  Remove = "-",
  Change = "=",
}

interface Lens {
  label: string;
  operation: Operation;
  hash: number;
  focalLength?: number;
}

interface Box {
  id: number;
  lenses: Lens[];
}

const boxes: Record<number, Box> = {};

function initBoxes() {
  for (let i = 0; i < 256; i++) {
    boxes[i] = {
      id: i,
      lenses: [],
    };
  }
}

function readInput(input: string): Lens[] {
  return input.split(",").map(parseLens);
}

function parseLens(input: string): Lens {
  if (input.indexOf(Operation.Remove) === -1) {
    // Here we should mark it as change
    const [label, focalLength] = input.split(Operation.Change);

    return {
      label,
      hash: hash(label),
      focalLength: parseInt(focalLength, 10),
      operation: Operation.Change,
    };
  } else {
    // Here we should mark it as removal
    const [label] = input.split(Operation.Remove);

    return {
      label,
      hash: hash(label),
      operation: Operation.Remove,
    };
  }
}

function processLenses(lenses: Lens[]): void {
  for (const lens of lenses) {
    const box = boxes[lens.hash];

    if (lens.operation === Operation.Change) {
      // If there is already a lens with the same label in the box, we should change it
      if (box.lenses.some((l) => l.label === lens.label)) {
        box.lenses = box.lenses.map((l) => (l.label === lens.label ? lens : l));
      } else {
        // Otherwise we should just add the new lens to the box
        box.lenses.push(lens);
      }
    } else if (lens.operation === Operation.Remove) {
      // If there is a lens with the same label in the box, we should remove it
      if (box.lenses.some((l) => l.label === lens.label)) {
        box.lenses = box.lenses.filter((l) => l.label !== lens.label);
      }
    }
  }
}

function calculateFocusPower(boxes: Record<number, Box>): number {
  let focusPower = 0;

  for (let boxIndex = 0; boxIndex < Object.keys(boxes).length; boxIndex++) {
    const box = boxes[boxIndex];

    for (let lensIndex = 0; lensIndex < box.lenses.length; lensIndex++) {
      const lens = box.lenses[lensIndex];

      const currentFocusPower =
        (1 + boxIndex) * (lensIndex + 1) * lens.focalLength!;

      focusPower += currentFocusPower;
    }
  }

  return focusPower;
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

initBoxes();

const parsedInput = readInput(inputLines);

processLenses(parsedInput);

const focusingPower = calculateFocusPower(boxes);

console.log(focusingPower);
