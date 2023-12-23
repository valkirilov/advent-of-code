import * as fs from "fs";
import * as _ from "lodash";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

let MAX = 0;

enum FieldType {
  Path = ".",
  Forest = "#",
  SlopeTop = "^",
  SlopeRight = ">",
  SlopeBottom = "v",
  SlopeLeft = "<",
  Visited = "O",
}

interface Point {
  x: number;
  y: number;
}

function readInput(input: string[]): FieldType[][] {
  return input.map((line) => line.split("") as FieldType[]);
}

function findLongestPathToTarget(
  map: FieldType[][],
  current: Point,
  target: Point,
  visited: Set<string>,
  memo: Map<string, number>,
  steps: number,
): number {
  const { x, y } = current;
  const key = `${x},${y}`;

  // If the current point is outside the map, we can't go there
  if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) {
    return -1;
  }

  // If the current point is already visited, we can't go there
  if (visited.has(key)) {
    return -1;
  }

  // If the current point is a forest, we can't go there
  if (map[y][x] === FieldType.Forest) {
    return -1;
  }

  // If the current point is the target, we found a path
  if (x === target.x && y === target.y) {
    if (steps > MAX) {
      MAX = steps;
      console.log(`New max: ${MAX}`);
    }

    return 0;
  }

  // Check if the solution for the current subproblem is already calculated
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  // Great, the current point is valid, let's visit it
  visited.add(key);

  const directions: Point[] = [
    { x: x + 1, y }, // right
    { x, y: y + 1 }, // bottom
    { x, y: y - 1 }, // top
    { x: x - 1, y }, // left
  ];

  // Now, let's continue the search in all directions
  let maxPath = 0;
  let reachedTargetInBranch = false;

  for (const direction of directions) {
    const path = findLongestPathToTarget(
      map,
      direction,
      target,
      visited,
      memo,
      steps + 1,
    );

    // Check if the path leads to the target
    if (path !== -1) {
      reachedTargetInBranch = true;
      maxPath = Math.max(maxPath, path + 1);
    }
  }

  // We're done with the current point, let's remove it from the visited set
  visited.delete(key);

  return reachedTargetInBranch ? maxPath : -1;

  // Save the result in the memo map for future reference
  memo.set(key, maxPath);

  return memo.get(key)!;
}

function printMap(map: FieldType[][]): void {
  console.log(map.map((line) => line.join("")).join("\n"));
}

function printVisited(map: FieldType[][], visited: Set<string>): void {
  const visitedMap = _.cloneDeep(map);

  for (const key of visited) {
    const [x, y] = key.split(",").map((n) => parseInt(n, 10));

    visitedMap[y][x] = FieldType.Visited;
  }

  printMap(visitedMap);
  console.log();
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const map = readInput(inputLines);
const memo = new Map<string, number>();
const startPoint: Point = {
  x: 1,
  y: 0,
};
const endPoint: Point = {
  x: map[0].length - 2,
  y: map.length - 1,
};

const visited = new Set<string>();
const longestPath = findLongestPathToTarget(
  map,
  startPoint,
  endPoint,
  visited,
  memo,
  0,
);

console.log(`Longest path: ${longestPath}`);
