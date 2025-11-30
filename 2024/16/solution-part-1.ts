import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

type Position = [number, number];

let min = Infinity;

enum Field {
  Wall = "#",
  Empty = ".",
  Start = "S",
  End = "E",
}

enum Direction {
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

const directionVectors: { [key in Direction]: Position } = {
  [Direction.Up]: [0, -1],
  [Direction.Down]: [0, 1],
  [Direction.Left]: [-1, 0],
  [Direction.Right]: [1, 0],
};
function readInput(input: string[]): Field[][] {
  return input.map((line) => line.split("") as Field[]);
}

function findStartPosition(map: Field[][]): Position {
  let startX;
  let startY;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === Field.Start) {
        startX = x;
        startY = y;
        break;
      }
    }
  }

  return [startX, startY] as [number, number];
}

function printMap(map: string[][], visited: boolean[][]): void {
  const output = map.map((line, y) =>
    line.map((cell, x) => (visited[y][x] ? "X" : cell)).join(""),
  );

  console.log(output.join("\n"));
}

function findCheapestPath(
  map: Field[][],
  position: Position,
  direction: Direction,
  cost: number,
  visited: boolean[][],
): number {
  const [x, y] = position;
  const currentField = map[y][x];

  if (currentField === Field.End) {
    // printMap(map, visited);
    return cost;
  }

  let cheapestPath = Infinity;
  let nextDirections: { direction: Direction; cost: number }[] = [
    { direction, cost: 1 },
  ];

  // Try to rotate left and right
  if (direction === Direction.Up || direction === Direction.Down) {
    nextDirections.push(
      { direction: Direction.Left, cost: 1001 },
      { direction: Direction.Right, cost: 1001 },
    );
  } else {
    nextDirections.push(
      { direction: Direction.Up, cost: 1001 },
      { direction: Direction.Down, cost: 1001 },
    );
  }

  // Try to move in all possible directions
  for (const {
    direction: nextDirection,
    cost: additionalCost,
  } of nextDirections) {
    const [dx, dy] = directionVectors[nextDirection];
    const [nextX, nextY] = [x + dx, y + dy];
    const nextField = map[nextY][nextX];

    if (nextField === Field.Wall || visited[nextY][nextX]) {
      continue;
    }

    const visitedCopy = visited.map((line) => [...line]);
    visitedCopy[nextY][nextX] = true;

    const nextPosition: Position = [nextX, nextY];
    const nextCost = findCheapestPath(
      map,
      nextPosition,
      nextDirection,
      cost + additionalCost,
      visitedCopy,
    );

    cheapestPath = Math.min(cheapestPath, nextCost);

    if (cheapestPath < min) {
      min = cheapestPath;
      console.log(min);
    }
  }

  return cheapestPath;
}

function initVisited(map: Field[][]): boolean[][] {
  return map.map((line) => line.map(() => false));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const map = readInput(inputLines);
const startPosition = findStartPosition(map);
const visited = initVisited(map);

const score = findCheapestPath(map, startPosition, Direction.Right, 0, visited);

console.log(score);

// 417552 too high
// 411540 too high
