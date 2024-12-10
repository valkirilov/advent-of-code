import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const START_POSITION = 0;
const END_POSITION = 9;

function readInput(input: string[]): number[][] {
  return input.map((line) => line.split("").map(Number));
}

function findAllStartPositions(map: number[][]): [number, number][] {
  const positions: [number, number][] = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === START_POSITION) {
        positions.push([row, col]);
      }
    }
  }

  return positions;
}

function findTrailheads(
  map: number[][],
  startPositions: [number, number][],
): number[] {
  const trailheads: number[] = [];

  for (const [row, col] of startPositions) {
    // We should go and find all the paths starting from this position and reaching 9, by going through 1 step increment at a time
    // We can go only to adjacent cells (up, down, left, right) and we can't go to cells that have already been visited
    // At the end, we should count all the paths that reach 9 and add them to the trailheads array
    const visited = generateVisitedMap(map);
    const trailhead = isTrailhead(map, [row, col], START_POSITION, visited);

    trailheads.push(trailhead);
  }

  return trailheads;
}

function generateVisitedMap(map: number[][]): boolean[][] {
  return map.map((row) => row.map(() => false));
}

function isTrailhead(
  map: number[][],
  position: [number, number],
  value: number,
  visited: boolean[][],
): number {
  // We should go and find all the paths starting from this position and reaching 9, by going through 1 step increment at a time
  // We can go only to adjacent cells (up, down, left, right) and we can't go to cells that have already been visited
  // At the end, we should count all the paths that reach 9 and add them to the trailheads array

  const [row, col] = position;

  // printMap(map, visited);

  // If we reached the end of the path
  if (map[row][col] === END_POSITION) {
    return 1;
  }

  // If we reached a visited cell
  if (visited[row][col]) {
    return 0;
  }

  visited[row][col] = true;

  // Go to all adjacent cells with the value + 1
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const possibleDirections = directions.filter(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    return (
      newRow >= 0 &&
      newRow < map.length &&
      newCol >= 0 &&
      newCol < map[row].length &&
      map[newRow][newCol] === value + 1
    );
  });

  if (possibleDirections.length === 0) {
    return 0;
  }

  return possibleDirections.reduce((acc, [dRow, dCol]) => {
    const visitedCopy = visited.map((row) => row.slice());
    return (
      acc + isTrailhead(map, [row + dRow, col + dCol], value + 1, visitedCopy)
    );
  }, 0);
}

function printMap(map: number[][], visited: boolean[][]): void {
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";

  for (let row = 0; row < map.length; row++) {
    let line = "";
    for (let col = 0; col < map[row].length; col++) {
      if (visited[row][col]) {
        line += `${yellow}x${reset}`;
      } else {
        if (!Number.isNaN(map[row][col])) {
          line += map[row][col];
        } else {
          line += ".";
        }
      }
    }
    console.log(line);
  }
  console.log("-----------------------------");
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const map = readInput(inputLines);
const startPositions = findAllStartPositions(map);
const trailheads = findTrailheads(map, startPositions);
const score = trailheads.reduce((acc, trailhead) => acc + trailhead, 0);
console.log(score);
