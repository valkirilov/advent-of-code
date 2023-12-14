import * as fs from "fs";
import * as _ from "lodash";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

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

function tiltField(
  input: string[][],
  direction: TiltDirection = TiltDirection.North,
): string[][] {
  // Note: Verify the direction, for now it's hardcoded
  // Flip the field 90 degrees clockwise, so we'll operate with rows instead of columns
  const field = _.zip(...input) as string[][];

  // Iterate over the rows to move the rounded rocks left
  const tiltedField = field.map(tiltFieldRow);

  return tiltedField;
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
const rocksLoad = calculateFieldLoad(tiltedField);

console.log("Rocks load:", rocksLoad);
