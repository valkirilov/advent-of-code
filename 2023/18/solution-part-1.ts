import * as fs from "fs";
import { parse } from "path";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Direction {
  Up = "U",
  Down = "D",
  Left = "L",
  Right = "R",
}

interface Instruction {
  direction: Direction;
  steps: number;
  color: string;
}

enum FieldCell {
  Empty = ".",
  Border = "#",
  Outer = "O",
  Fill = "X",
}

function readInput(input: string[]): Instruction[] {
  return input.map(parseInstruction);
}

function parseInstruction(line: string): Instruction {
  const [direction, steps, color] = line.split(" ");

  return {
    direction: direction as Direction,
    steps: parseInt(steps),
    color,
  };
}

function initField(instructions: Instruction[]): FieldCell[][] {
  const { width, height } = determineFieldSize(instructions);
  const field = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => FieldCell.Empty),
  );

  return field;
}

function determineFieldSize(instructions: Instruction[]): {
  width: number;
  height: number;
} {
  let top = 0;
  let right = 0;
  let bottom = 0;
  let left = 0;

  instructions.forEach((instruction) => {
    switch (instruction.direction) {
      case Direction.Up:
        top += instruction.steps;
        break;
      case Direction.Down:
        bottom += instruction.steps;
        break;
      case Direction.Left:
        left += instruction.steps;
        break;
      case Direction.Right:
        right += instruction.steps;
        break;
    }
  });

  return {
    width: (left + right) * 2,
    height: (top + bottom) * 2,
  };
}

function addFieldBorders(
  field: FieldCell[][],
  instructions: Instruction[],
): FieldCell[][] {
  let x = field[0].length / 2;
  let y = field.length / 2;

  // Go through all instructions and paint the field
  instructions.forEach((instruction) => {
    const { direction, steps } = instruction;
    const [dX, dY] = getDirectionDelta(direction);

    for (let j = 0; j < steps; j++) {
      x += dX;
      y += dY;

      if (field[y][x] === FieldCell.Empty) {
        field[y][x] = FieldCell.Border;
      }
    }
  });

  // Find the edges
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < field.length; y++) {
    if (field[y].includes(FieldCell.Border)) {
      if (y < minY) {
        minY = y;
      }

      if (y > maxY) {
        maxY = y;
      }
    }

    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === FieldCell.Border) {
        if (x < minX) {
          minX = x;
        }

        if (x > maxX) {
          maxX = x;
        }
      }
    }
  }

  // Strip empty edges
  field.splice(maxY + 1);
  field.splice(0, minY);

  for (let y = 0; y < field.length; y++) {
    field[y].splice(maxX + 1);
    field[y].splice(0, minX);
  }

  return field;
}

function printField(field: FieldCell[][]): void {
  field.forEach((row) => {
    console.log(row.join(""));
  });
}

function getDirectionDelta(direction: Direction): [number, number] {
  let dX = 0;
  let dY = 0;

  switch (direction) {
    case Direction.Up:
      dY = -1;
      break;
    case Direction.Down:
      dY = 1;
      break;
    case Direction.Left:
      dX = -1;
      break;
    case Direction.Right:
      dX = 1;
      break;
  }

  return [dX, dY];
}

function addFieldFill(field: FieldCell[][]): FieldCell[][] {
  markFieldOuters(field);

  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === FieldCell.Empty) {
        field[y][x] = FieldCell.Fill;
      }
    }
  }

  return field;
}

function markFieldOuters(matrix: string[][]): void {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  // Helper function to perform depth-first search and fill empty spaces
  function dfs(row: number, col: number): void {
    // Check if the current cell is within bounds and is an empty space
    if (
      row < 0 ||
      row >= numRows ||
      col < 0 ||
      col >= numCols ||
      matrix[row][col] !== "."
    ) {
      return;
    }

    // Fill the current cell with 'O'
    matrix[row][col] = FieldCell.Outer;

    // Explore adjacent cells
    dfs(row - 1, col); // Up
    dfs(row + 1, col); // Down
    dfs(row, col - 1); // Left
    dfs(row, col + 1); // Right
  }

  // Iterate through the border cells and start DFS from empty spaces
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (
        matrix[row][col] === "." &&
        (row === 0 || row === numRows - 1 || col === 0 || col === numCols - 1)
      ) {
        dfs(row, col);
      }
    }
  }
}

function determineFieldArea(field: FieldCell[][]): number {
  let area = 0;

  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if ([FieldCell.Border, FieldCell.Fill].includes(field[y][x])) {
        area++;
      }
    }
  }

  return area;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const instructions = readInput(inputLines);
const field = initField(instructions);
const fieldWithBorders = addFieldBorders(field, instructions);
const filledField = addFieldFill(fieldWithBorders);
const fieldArea = determineFieldArea(filledField);

console.log("Field area:", fieldArea);
