import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Directions {
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

enum Fields {
  Start = Directions.Up,
  Obstacle = "#",
  Empty = ".",
}

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

function findStartPosition(input: string[][]): [number, number] {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === Fields.Start) {
        return [x, y];
      }
    }
  }

  throw new Error("Start position not found");
}

function findMoves(
  input: string[][],
  startPosition: [number, number],
): [number, number][] {
  let x = startPosition[0];
  let y = startPosition[1];
  let moves: [number, number][] = [];

  let direction = Directions.Up;

  do {
    if (isPositionOutside(input, x, y)) {
      break;
    } else if (input[y][x] === Fields.Start || input[y][x] === Fields.Empty) {
      moves.push([x, y]);
      const [dx, dy] = getMoveDirection(direction);

      x += dx;
      y += dy;
    } else if (input[y][x] === Fields.Obstacle) {
      // Go back to the previous position
      const [pdx, pdy] = getPreviousPlace(direction);

      x += pdx;
      y += pdy;

      // Change the direction
      const [dx, dy, newDirection] = getChangedDirection(direction);

      x += dx;
      y += dy;

      direction = newDirection;
    }
  } while (true);

  return moves;
}

function isPositionOutside(input: string[][], x: number, y: number): boolean {
  return x < 0 || y < 0 || y >= input.length || x >= input[y].length;
}

function getMoveDirection(direction: Directions): [number, number] {
  let dx = 0;
  let dy = 0;

  switch (direction) {
    case Directions.Up:
      dy = -1;
      break;
    case Directions.Down:
      dy = 1;
      break;
    case Directions.Left:
      dx = -1;
      break;
    case Directions.Right:
      dx = 1;
      break;
  }

  return [dx, dy];
}

function getPreviousPlace(direction: Directions): [number, number] {
  let dx = 0;
  let dy = 0;

  switch (direction) {
    case Directions.Up:
      dy = 1;
      break;
    case Directions.Down:
      dy = -1;
      break;
    case Directions.Left:
      dx = 1;
      break;
    case Directions.Right:
      dx = -1;
      break;
  }

  return [dx, dy];
}

function getChangedDirection(
  direction: Directions,
): [number, number, Directions] {
  let dx = 0;
  let dy = 0;
  let newDirection = Directions.Up;

  switch (direction) {
    case Directions.Up:
      dx = 1;
      newDirection = Directions.Right;
      break;
    case Directions.Down:
      dx = -1;
      newDirection = Directions.Left;
      break;
    case Directions.Left:
      dy = -1;
      newDirection = Directions.Up;
      break;
    case Directions.Right:
      dy = 1;
      newDirection = Directions.Down;
      break;
  }

  return [dx, dy, newDirection];
}

function printMaze(
  input: string[][],
  position: [number, number],
  direction: Directions,
): void {
  // Print the maze and replace the current position with the direction
  const maze = input.map((line) => line.join(""));
  maze[position[1]] =
    maze[position[1]].substring(0, position[0]) +
    direction +
    maze[position[1]].substring(position[0] + 1);

  console.log(maze.join("\n"));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const startPosition = findStartPosition(parsedInput);
const moves = findMoves(parsedInput, startPosition);
const uniqueMoves = new Set(moves.map((move) => move.join(",")));

console.log(uniqueMoves.size);
