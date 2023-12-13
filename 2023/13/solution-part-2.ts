import * as fs from "fs";
import * as _ from "lodash";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Field {
  rows: string[];
  cols: string[];
}

function readInput(input: string[]): Field[] {
  let fields: Field[] = [];

  let currentField: Field = {
    rows: [],
    cols: [],
  };

  do {
    const line = input.shift();

    if (line === "" || input.length === 0) {
      if (input.length === 0) {
        currentField.rows.push(line!);
      }

      fields.push(currentField);

      currentField = {
        rows: [],
        cols: [],
      };
    } else {
      currentField.rows.push(line!);
      currentField.cols.push(line!); // Note: We'll transform this later, when we know the whole field
    }
  } while (input.length > 0);

  fields = fields.map(transformFieldCols);

  return fields;
}

function transformFieldCols(field: Field): Field {
  const { rows } = field;

  const numRows = rows.length;
  const numCols = rows[0].length;

  const transformedCols: string[] = [];

  for (let col = 0; col < numCols; col++) {
    let newRow = "";
    for (let row = 0; row < numRows; row++) {
      newRow += rows[row][col];
    }

    transformedCols.push(newRow);
  }

  return {
    rows,
    cols: transformedCols,
  };
}

function findReflections(fields: Field[]): number {
  let count = 0;

  for (const field of fields) {
    const reflections = findFieldReflections(field);

    count += reflections[0] * 100;
    count += reflections[1];
  }

  return count;
}

function findFieldReflections(field: Field): [number, number] {
  const { rows, cols } = field;

  const rowReflections = countReflectionLines(rows);
  const colReflections = countReflectionLines(cols);

  return [rowReflections, colReflections];
}
function countReflectionLines(grid: string[]): number {
  for (let r = 1; r < grid.length; r++) {
    let above = grid.slice(0, r).reverse();
    let below = grid.slice(r);

    // Compare all lines, but in reverse
    const element_differences = [];

    // # Calculate the sum of differences for each pair of elements in x and y
    for (let i = 0; i < Math.min(above.length, below.length); i++) {
      const x = above[i];
      const y = below[i];

      const differences = [];

      // Calculate the differences for each pair of elements in x and y
      for (let j = 0; j < Math.min(x.length, y.length); j++) {
        const a = x[j];
        const b = y[j];

        let diff = 0;
        if (a !== b) {
          diff = 1;
        }

        differences.push(diff);
      }

      const differenceSum = _.sum(differences);
      element_differences.push(differenceSum);
    }

    if (_.sum(element_differences) === 1) {
      return r;
    }
  }

  return 0;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const reflections = findReflections(parsedInput);
console.log(reflections);
