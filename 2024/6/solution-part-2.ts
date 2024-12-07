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
  CustomObstacle = "O",
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

function getNextPosition(direction: Directions): [number, number] {
  switch (direction) {
    case Directions.Up:
      return [0, -1];
    case Directions.Down:
      return [0, 1];
    case Directions.Left:
      return [-1, 0];
    case Directions.Right:
      return [1, 0];
  }
}

function traverseMap(
  input: string[][],
  startPosition: [number, number],
  isAddingCustomObstacle = false,
): boolean {
  let [x, y] = startPosition;
  let direction = Directions.Up;

  const moves: Set<string> = new Set();

  while (true) {
    const moveKey = `${x},${y},${direction}`;

    if (moves.has(moveKey)) {
      return true;
    }

    moves.add(moveKey);

    const [dx, dy] = getNextPosition(direction);
    const [nextX, nextY] = [x + dx, y + dy];

    if (isPositionOutside(nextX, nextY, input)) {
      return false;
    }

    if (
      input[nextY][nextX] === Fields.Obstacle ||
      input[nextY][nextX] === Fields.CustomObstacle
    ) {
      direction = getNextDirection(direction);
    } else {
      if (isAddingCustomObstacle) {
        const inputCopy = input.map((line) => line.slice());
        inputCopy[nextY][nextX] = Fields.CustomObstacle;

        if (traverseMap(inputCopy, startPosition)) {
          loops.add(`${nextX},${nextY}`);
        }
      }

      x = nextX;
      y = nextY;
    }
  }
}

function isPositionOutside(x: number, y: number, input: string[][]): boolean {
  return x < 0 || x >= input[0].length || y < 0 || y >= input.length;
}

function getNextDirection(currentDirection: Directions): Directions {
  switch (currentDirection) {
    case Directions.Up:
      return Directions.Right;
    case Directions.Right:
      return Directions.Down;
    case Directions.Down:
      return Directions.Left;
    case Directions.Left:
      return Directions.Up;
  }
}

function printMap(input: string[][]): void {
  console.log("");
  console.log("--------------------");
  console.log("");
  console.log(input.map((line) => line.join("")).join("\n"));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const startPosition = findStartPosition(parsedInput);
const loops: Set<string> = new Set();
traverseMap(parsedInput, startPosition, true);

console.log(loops.size);
