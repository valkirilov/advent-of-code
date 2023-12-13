import * as fs from "fs";

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

  const rowReflections = findLineReflections(rows);
  const colReflections = findLineReflections(cols);

  return [rowReflections, colReflections];
}

function findLineReflections(lines: string[]): number {
  // First, check for two identical lines, so we know we have at least one reflection and where to start counting
  let reflectionIndexes = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const originalLine = lines[i];
    const nextLine = lines[i + 1];

    if (originalLine === nextLine) {
      reflectionIndexes.push(i + 1);
    }
  }

  if (reflectionIndexes.length === 0) {
    return 0;
  }

  const reflections = reflectionIndexes.map((index) =>
    countReflectionLines(lines, index),
  );

  return reflections.reduce((acc, curr) => acc + curr, 0);
}

function countReflectionLines(
  lines: string[],
  reflectionIndex: number,
): number {
  let reflections = false;

  // Now, let's count the reflections going in both directions
  for (let i = 0; i < lines.length - reflectionIndex; i++) {
    const currentIndex = reflectionIndex + i;
    const prevIndex = reflectionIndex - i - 1;

    if (currentIndex >= lines.length || prevIndex < 0) {
      break;
    }

    const currentLine = lines[currentIndex];
    const prevLine = lines[prevIndex];

    if (currentLine === prevLine) {
      reflections = true;
    } else {
      if (currentIndex === lines.length - 1 && prevIndex <= 0) {
        reflections = true;
        break;
      } else {
        reflections = false;
        break;
      }
    }

    if (currentIndex === lines.length - 1 && prevIndex <= 0) {
      reflections = true;
      break;
    }
  }

  return reflections ? reflectionIndex : 0;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const reflections = findReflections(parsedInput);
console.log(reflections);
