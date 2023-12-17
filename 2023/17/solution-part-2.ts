import * as fs from "fs";
import PriorityQueue from "ts-priority-queue";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Direction {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

interface State {
  heatLoss: number;
  x: number;
  y: number;
  direction: Direction;
  steps: number;
}

const MIN_STEPS = 4;
const MAX_STEPS = 10;

function readInput(input: string[]): number[][] {
  return input.map((line) => line.split("").map((char) => parseInt(char)));
}

function printMatrix(matrix: number[][]): void {
  matrix.forEach((row) => console.log(row.join("")));
}

function printVisited(visited: boolean[][]): void {
  visited.forEach((row) =>
    console.log(row.map((v) => (v ? "1" : "0")).join("")),
  );
}

function findPath(matrix: number[][]): number | void {
  const seen: Record<string, number> = {};
  const queue = new PriorityQueue({
    comparator: (a: State, b: State) => a.heatLoss - b.heatLoss,
  });

  // Start with the first cell
  queue.queue({
    heatLoss: 0,
    x: 0,
    y: 0,
    direction: Direction.Right,
    steps: 0,
  });

  while (queue.length > 0) {
    const { heatLoss, x, y, direction, steps } = queue.dequeue();

    // Check if we're out of bounds
    if (x < 0 || x >= matrix[0].length || y < 0 || y >= matrix.length) {
      continue;
    }

    // Check if we've reached the end
    if (y === matrix.length - 1 && x === matrix[0].length - 1) {
      return heatLoss;
    }

    // Check if we've already visited this cell
    const key = `${x}-${y}-${direction}-${steps}`;
    if (key in seen) {
      continue;
    }

    // Mark the cell as visited
    seen[key] = heatLoss;

    // And let's proceed with the next cell
    const directions = getPossibleDirections(direction, steps);
    directions.forEach((nextDirection) => {
      const [dX, dY] = getNextCoords(nextDirection);

      const nextX = x + dX;
      const nextY = y + dY;

      // Verify if we're out of bounds
      if (
        nextX < 0 ||
        nextX >= matrix[0].length ||
        nextY < 0 ||
        nextY >= matrix.length
      ) {
        return;
      }

      const nextHeatLoss = heatLoss + matrix[nextY][nextX];
      const nextSteps = nextDirection === direction ? steps + 1 : 1;

      queue.queue({
        heatLoss: nextHeatLoss,
        x: nextX,
        y: nextY,
        direction: nextDirection,
        steps: nextSteps,
      });
    });
  }
}

function getNextCoords(direction: Direction): [number, number] {
  if (direction === Direction.Top) {
    return [0, -1];
  } else if (direction === Direction.Right) {
    return [1, 0];
  } else if (direction === Direction.Bottom) {
    return [0, 1];
  }

  // Else if (direction === Direction.Left) {
  return [-1, 0];
}

function getPossibleDirections(
  direction: Direction,
  steps: number,
): Direction[] {
  let directions = [];

  // If we started to go in a particular direction, we should go at least X steps
  if (steps < MIN_STEPS) {
    directions.push(direction);
    return directions;
  }

  // If we are going in the same direction, we can make max Y steps
  if (steps < MAX_STEPS) {
    directions.push(direction);
  }

  // We can always go in the opposite directions, but not back
  if (direction === Direction.Top || direction === Direction.Bottom) {
    directions.push(Direction.Right);
    directions.push(Direction.Left);
  } else if (direction === Direction.Right || direction === Direction.Left) {
    directions.push(Direction.Bottom);
    directions.push(Direction.Top);
  }

  return directions;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const minimumHearLoss = findPath(parsedInput);

console.log(`Minimum heat loss is ${minimumHearLoss}`);
