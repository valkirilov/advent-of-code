import { ECDH } from "crypto";
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

enum PipeEnclosure {
  Inside = "I",
  Outside = "O",
  Pipe = "*",
  Empty = ".",
}

interface Point {
  x: number;
  y: number;
  value?: PipeType | PipeEnclosure;
}

interface Maze {
  start: Point;
  map: PipeType[][];
  path: number[][];
  visited: number[][];
  enclosures: PipeEnclosure[][];
}

function readInput(input: string[]): Maze {
  const map = readMap(input);
  const start = findStart(map);
  const path = initVisited(map, -1);
  const visited = initVisited(map, 0);
  const enclosures = initEnclosures(map);

  return {
    map,
    start,
    path,
    visited,
    enclosures,
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

  // return { x: 1, y: 1, value: PipeType.TopLeft }; // Example 2-1
  // return { x: 12, y: 4, value: PipeType.TopLeft }; // Example 2-2
  // return { x: 4, y: 0, value: PipeType.TopRight }; // Example 2-3
  // return { x: 36, y: 128, value: PipeType.TopLeft }; // Puzzle

  throw new Error("No start found");
}

function initVisited(map: PipeType[][], initialValue: number): number[][] {
  return map.map((line) => line.map(() => initialValue));
}

function initEnclosures(map: PipeType[][]): PipeEnclosure[][] {
  return map.map((line) => line.map(() => PipeEnclosure.Empty));
}

function findPath(
  maze: Maze,
  currentPoint: Point,
  pathLength: number = 0,
): number | boolean {
  const { map, enclosures } = maze;
  const path = maze.path;
  const point = getPointValue(map, currentPoint) as Point;

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
  if (path[point.y][point.x] >= 0) {
    if (point.value === PipeType.Start) {
      return pathLength;
    }

    return false;
  }

  // Mark the point as visited
  path[point.y][point.x] = pathLength;
  enclosures[point.y][point.x] = PipeEnclosure.Pipe;

  // Go in all possible directions and see if we can find the end
  const possibleDirections = getDirections(point);
  const possiblePaths = possibleDirections
    .map((direction) => {
      // Skip the direction if out of bounds
      if (
        direction.x < 0 ||
        direction.x >= map[0].length ||
        direction.y < 0 ||
        direction.y >= map.length
      ) {
        return 0;
      }

      // Skip the direction if we already visited it
      if (path[direction.y][direction.x] > 0) {
        return 0;
      }

      return findPath({ ...maze, path }, direction, pathLength + 1);
    })
    .map(Number);

  // Find the max possible path length
  const maxPathLength = Math.max(...possiblePaths);

  return maxPathLength;
}

function getPointValue(
  map: PipeType[][] | PipeEnclosure[][],
  point: Point,
): Point | false {
  const { x, y } = point;

  // If the point is outside, we can't go there
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return false;
  }

  return {
    ...point,
    value: map[y][x],
  };
}

function getDirections(point: Point): Point[] {
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
  } else {
    throw new Error("Unknown pipe type");
  }

  return directions;
}

function findEnclosures(maze: Maze, start: Point) {
  const { map, enclosures, visited } = maze;
  const { x, y } = start;

  // If the point is outside, we can't go there
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) {
    return;
  }

  // If the point is a pipe, we can't go there
  if (enclosures[y][x] === PipeEnclosure.Pipe) {
    visited[y][x] = 2;
    return;
  }

  // If the point is already visited, we can't go there
  if (visited[y][x] > 0) {
    return;
  }

  // Mark the point as visited
  visited[y][x] = 1;

  // If the point is empty, it's worth checking if it's an enclosure
  if (enclosures[y][x] === PipeEnclosure.Empty) {
    // If the point is on the border, it's an outside enclosure
    if (x === 0 || x === map[0].length - 1 || y === 0 || y === map.length - 1) {
      enclosures[y][x] = PipeEnclosure.Outside;
    }

    const possibleNeighbors = [
      getPointValue(enclosures, { x: x - 1, y }),
      getPointValue(enclosures, { x: x + 1, y }),
      getPointValue(enclosures, { x, y: y - 1 }),
      getPointValue(enclosures, { x, y: y + 1 }),
    ].filter(Boolean) as Point[];

    if (
      possibleNeighbors.some(
        (neighbor) => neighbor.value === PipeEnclosure.Outside,
      )
    ) {
      enclosures[y][x] = PipeEnclosure.Outside;
    }
  }

  // If the point is marked as an outside enclosure, go in all possible directions
  findEnclosures(maze, { x: x - 1, y });
  findEnclosures(maze, { x: x + 1, y });
  findEnclosures(maze, { x, y: y - 1 });
  findEnclosures(maze, { x, y: y + 1 });
}

function findEnclosuresCount(maze: Maze): number {
  // Erase the pipes that are pipes but not part of the main one
  for (let y = 0; y < maze.map.length; y++) {
    for (let x = 0; x < maze.map[y].length; x++) {
      const currentPoint = getPointValue(maze.map, { x, y }) as Point;

      if (currentPoint.value !== PipeType.Empty && maze.path[y][x] === -1) {
        maze.map[y][x] = PipeType.Empty;
      }
    }
  }

  const points = spiralOrderIndexes(maze.map.length, maze.map[0].length);
  maze.visited = initVisited(maze.map, 0);

  for (const point of points) {
    findEnclosures(maze, point);
  }

  // Try to count the intersections for the points that are not checked yet
  for (let y = 0; y < maze.map.length; y++) {
    for (let x = 0; x < maze.map[y].length; x++) {
      if (maze.enclosures[y][x] === PipeEnclosure.Empty) {
        // Go to the right and count the number of intersections
        const intersectionsCount = countIntersections(maze, { x, y });

        if (intersectionsCount % 2 === 0) {
          maze.enclosures[y][x] = PipeEnclosure.Outside;
        } else {
          maze.enclosures[y][x] = PipeEnclosure.Inside;
        }
      }
    }
  }

  const { enclosures } = maze;
  let enclosuresCount = 0;

  for (let y = 0; y < enclosures.length; y++) {
    const line = enclosures[y];
    for (let x = 0; x < line.length; x++) {
      if (line[x] === PipeEnclosure.Empty || line[x] === PipeEnclosure.Inside) {
        enclosures[y][x] = PipeEnclosure.Inside;
        enclosuresCount++;
      }
    }
  }

  return enclosuresCount;
}

// Go to the right and count the number of intersections
function countIntersections(maze: Maze, start: Point): number {
  const { map, path } = maze;
  const { x: startX, y } = start;

  let intersectionsCount = 0;
  let currentPipeDirection;

  let x = startX;
  do {
    x++;

    let point = getPointValue(map, { x, y }) as Point;

    // If the point is empty, we don't care
    if (point.value === PipeType.Empty) {
      continue;
    }

    // If we hit a real horizontal pipe, we ignore it
    if (point.value === PipeType.Horizontal) {
      continue;
    }

    // If we hit a real vertical pipe, we count the intersection
    if (point.value === PipeType.Vertical && path[y][x] > 0) {
      intersectionsCount++;

      // If we already have open pipes and hit this vertical one, we should close it and count it as an intersection
      if (currentPipeDirection !== undefined) {
        intersectionsCount++;
        currentPipeDirection = undefined;
      }

      continue;
    }

    // So far, we already counted the intersections for the vertical pipes and we ignore the empty spaces
    // This means that we can only hit real pipes from now on

    // If we don't have a current pipe direction, we found a new pipe
    if (currentPipeDirection === undefined) {
      currentPipeDirection = point.value;
      continue;
    }

    // If we have an open F pipe, we should check if we hit J
    if (
      currentPipeDirection === PipeType.TopLeft &&
      point.value === PipeType.BottomRight
    ) {
      intersectionsCount++;
      currentPipeDirection = undefined;
      continue;
    }

    // But if we have an open F pipe and we hit 7, we should close it and don't count it as an intersection
    if (
      currentPipeDirection === PipeType.TopLeft &&
      point.value === PipeType.TopRight
    ) {
      currentPipeDirection = undefined;
      continue;
    }

    // Or if we have an open L pipe, we should check if we hit 7
    if (
      currentPipeDirection === PipeType.BottomLeft &&
      point.value === PipeType.TopRight
    ) {
      intersectionsCount++;
      currentPipeDirection = undefined;
    }

    // But if we have an open L pipe and we hit J, we should close it and don't count it as an intersection
    if (
      currentPipeDirection === PipeType.BottomLeft &&
      point.value === PipeType.BottomRight
    ) {
      currentPipeDirection = undefined;
      continue;
    }
  } while (x < map[y].length);

  return intersectionsCount;
}

function spiralOrderIndexes(
  rows: number,
  cols: number,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];

  // Top horizontal border
  for (let x = 0; x < cols; x++) {
    points.push({ x, y: 0 });
  }

  // Right vertical border
  for (let y = 1; y < rows; y++) {
    points.push({ x: cols - 1, y });
  }

  // Bottom horizontal border
  for (let x = cols - 2; x >= 0; x--) {
    points.push({ x, y: rows - 1 });
  }

  // Left vertical border
  for (let y = rows - 2; y > 0; y--) {
    points.push({ x: 0, y });
  }

  return points;
}

function printMaze(maze: Maze): void {
  const { map, enclosures } = maze;

  // console.log("map:");
  // console.log(
  //   maze.map
  //     .map((line) => line.map((value) => value.toString().padStart(2)).join(""))
  //     .join("\n"),
  // );

  // console.log("path:");
  // console.log(
  //   maze.path
  //     .map((line) => line.map((value) => value.toString().padStart(4)).join(""))
  //     .join("\n"),
  // );

  // console.log("visited:");
  // console.log(
  //   maze.visited
  //     .map((line) => line.map((value) => value.toString().padStart(3)).join(""))
  //     .join("\n"),
  // );

  // console.log("enclosures:");
  // console.log(
  //   maze.enclosures
  //     .map((line) => line.map((value) => value.toString().padStart(2)).join(""))
  //     .join("\n"),
  // );

  const PIPE_MAP: Record<PipeType, string> = {
    [PipeType.Horizontal]: "─",
    [PipeType.Vertical]: "│",
    [PipeType.TopLeft]: "┌",
    [PipeType.TopRight]: "┐",
    [PipeType.BottomRight]: "┘",
    [PipeType.BottomLeft]: "└",
    [PipeType.Start]: "S",
    [PipeType.Empty]: ".",
  };

  const ENCLOSURE_MAP: Record<PipeEnclosure, string> = {
    [PipeEnclosure.Inside]: "I",
    [PipeEnclosure.Outside]: "O",
    [PipeEnclosure.Pipe]: "*",
    [PipeEnclosure.Empty]: ".",
  };

  console.log("Final map:");
  // Draw the maze map and enclosers using the PIPE_MAP and ENCLOSURE_MAP
  const finalMap = maze.map.map((line, y) =>
    line.map((value, x) => {
      const enclosure = enclosures[y][x];
      if (
        enclosure === PipeEnclosure.Inside ||
        enclosure === PipeEnclosure.Outside
      ) {
        return ENCLOSURE_MAP[enclosure];
      }

      return PIPE_MAP[value];
    }),
  );

  console.log(finalMap.map((line) => line.join("")).join("\n"));
}

function logIf(condition: boolean, ...messages: any[]): void {
  if (condition) {
    console.log(messages);
  }
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const maze = readInput(inputLines);
const path = findPath(maze, maze.start);
const enclosures = findEnclosuresCount(maze);

printMaze(maze);
console.log(enclosures);
