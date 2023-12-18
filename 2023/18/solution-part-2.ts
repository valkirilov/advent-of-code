import * as fs from "fs";
import { parse } from "path";
import { WritableStreamDefaultWriter } from "stream/web";

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

interface Point {
  x: number;
  y: number;
}

function readInput(input: string[]): Instruction[] {
  return input.map(parseInstruction);
}

function parseInstruction(line: string): Instruction {
  const [_direction, _steps, color] = line.split(" ");
  const [direction, steps] = parseColorInstruction(color);

  return {
    direction: direction as Direction,
    steps: steps,
    color,
  };
}

function parseColorInstruction(color: string): [Direction, number] {
  // Split the start and end symbols (to remove the slashes)
  color = color.slice(1, -1);

  // Get the last character of the color to determine the direction
  const directionNumber = color[color.length - 1];
  let direction;

  switch (directionNumber) {
    case "0":
      direction = Direction.Right;
      break;
    case "1":
      direction = Direction.Down;
      break;
    case "2":
      direction = Direction.Left;
      break;
    case "3":
      direction = Direction.Up;
      break;
  }

  // Get the number of steps
  const stepsHex = color.slice(1, -1);
  const steps = parseInt(stepsHex, 16);

  return [direction as Direction, steps];
}

function determineBoundaries(instructions: Instruction[]): {
  points: Point[];
  boundaryPoints: number;
} {
  const boundaries: Point[] = [{ x: 0, y: 0 }];
  let boundaryPoints = 0;

  instructions.forEach((instruction) => {
    const { direction, steps } = instruction;
    const [dx, dy] = getDirectionDelta(direction);
    const { x, y } = boundaries[boundaries.length - 1];

    const nextX = x + dx * steps;
    const nextY = y + dy * steps;

    boundaries.push({ x: nextX, y: nextY });
    boundaryPoints += steps;
  });

  return {
    points: boundaries,
    boundaryPoints,
  };
}

function getDirectionDelta(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.Up:
      return [0, -1];
    case Direction.Down:
      return [0, 1];
    case Direction.Left:
      return [-1, 0];
    case Direction.Right:
      return [1, 0];
  }
}

function calculateArea(points: Point[], boundaryPoints: number): number {
  let area = 0;

  // First, let's calculate the area of the polygon that is surrounded by the borders using the shoelace formula
  // https://en.wikipedia.org/wiki/Shoelace_formula
  for (let i = 0; i < points.length - 1; i++) {
    const point1 = points[i];
    const point2 = points[i + 1];

    area += point1.x * point2.y - point2.x * point1.y;
  }

  // Then, let's do some magic to get the area of the polygon that is surrounded by the borders and the path
  const i = (area - boundaryPoints) / 2 + 1;

  return i + boundaryPoints;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const instructions = readInput(inputLines);
const { points, boundaryPoints } = determineBoundaries(instructions);
const area = calculateArea(points, boundaryPoints);

console.log(area);
