import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum PipeType {
  Horizontal = "-",
  Vertical = "|",
  TopLeft = "F",
  TopRight = "7",
  BottomRight = "J",
  BottomLeft = "L",
  Start = "S",
  Empty = ".",
}

interface Point {
  x: number;
  y: number;
  value?: PipeType;
}

interface Maze {
  start: Point;
  map: PipeType[][];
  visited: number[][];
}

function readInput(input: string[]): Maze {
  const map = readMap(input);
  const start = findStart(map);
  const visited = initVisited(map);

  return {
    map,
    start,
    visited,
  };
}

function readMap(input: string[]): PipeType[][] {
  return input.map((line) => line.split("") as PipeType[]);
}

function findStart(map: PipeType[][]): Point {
  for (let y = 0; y < map.length; y++) {
    const line = map[y];
    for (let x = 0; x < line.length; x++) {
      if (line[x] === PipeType.Start) {
        return { x, y, value: PipeType.Start };
      }
    }
  }

  throw new Error("No start found");
}

function initVisited(map: PipeType[][]): number[][] {
  return map.map((line) => line.map(() => -1));
}

function findPath(
  maze: Maze,
  currentPoint: Point,
  pathLength: number = 0,
): number | boolean {
  const { map } = maze;
  // const visited = deepCopy(maze.visited)
  const visited = maze.visited;
  const point = getPointValue(maze, currentPoint);

  // If we are out of bounds we can't go there
  if (
    point.x < 0 ||
    point.x >= map[0].length ||
    point.y < 0 ||
    point.y >= map.length
  ) {
    return false;
  }

  // If the point is empty we can't go there
  if (point.value === PipeType.Empty) {
    return false;
  }

  // If we already visited this point, we can't go there unless we found the end
  if (visited[point.y][point.x] >= 0) {
    if (point.value === PipeType.Start) {
      return pathLength;
    }

    return false;
  }

  // Mark the point as visited
  visited[point.y][point.x] = pathLength;

  // Go in all possible directions and see if we can find the end
  const possibleDirections = getDirections(maze, point);

  const possiblePaths = possibleDirections
    .map((direction) => {
      // Skip the direction if we already visited it
      if (visited[direction.y][direction.x] > 0) {
        return 0;
      }

      return findPath({ ...maze, visited }, direction, pathLength + 1);
    })
    .map(Number);

  // Find the max possible path length
  const maxPathLength = Math.max(...possiblePaths);

  return maxPathLength;
}

function getPointValue(maze: Maze, point: Point): Point {
  const { map } = maze;

  return {
    ...point,
    value: map[point.y][point.x],
  };
}

function deepCopy<T>(array: T[][]): T[][] {
  return array.map(function (arr) {
    return arr.slice();
  });
}

function getDirections(maze: Maze, point: Point): Point[] {
  const directions = [];

  if (point.value === PipeType.Horizontal) {
    directions.push({ x: point.x - 1, y: point.y });
    directions.push({ x: point.x + 1, y: point.y });
  } else if (point.value === PipeType.Vertical) {
    directions.push({ x: point.x, y: point.y - 1 });
    directions.push({ x: point.x, y: point.y + 1 });
  } else if (point.value === PipeType.TopLeft) {
    directions.push({ x: point.x + 1, y: point.y });
    directions.push({ x: point.x, y: point.y + 1 });
  } else if (point.value === PipeType.TopRight) {
    directions.push({ x: point.x - 1, y: point.y });
    directions.push({ x: point.x, y: point.y + 1 });
  } else if (point.value === PipeType.BottomRight) {
    directions.push({ x: point.x - 1, y: point.y });
    directions.push({ x: point.x, y: point.y - 1 });
  } else if (point.value === PipeType.BottomLeft) {
    directions.push({ x: point.x + 1, y: point.y });
    directions.push({ x: point.x, y: point.y - 1 });
  } else if (point.value === PipeType.Start) {
    directions.push({ x: point.x + 1, y: point.y });
    directions.push({ x: point.x - 1, y: point.y });
    directions.push({ x: point.x, y: point.y + 1 });
    directions.push({ x: point.x, y: point.y - 1 });
  }

  return directions;
}

function printMaze(maze: Maze): void {
  const { map } = maze;

  console.log("map:");
  console.log(
    maze.map
      .map((line) => line.map((value) => value.toString().padStart(2)).join(""))
      .join("\n"),
  );

  console.log("visited:");
  console.log(
    maze.visited
      .map((line) => line.map((value) => value.toString().padStart(3)).join(""))
      .join("\n"),
  );
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const maze = readInput(inputLines);
const path = findPath(maze, maze.start);

printMaze(maze);
console.log((path as number) / 2);
