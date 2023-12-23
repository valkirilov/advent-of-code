import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum FieldType {
  Path = ".",
  Forest = "#",
  SlopeTop = "^",
  SlopeRight = ">",
  SlopeBottom = "v",
  SlopeLeft = "<",
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
    return 0;
  }

  // Great, the current point is valid, let's visit it
  visited.add(key);

  // Now, let's continue the search based on the type of the current point
  const directions: Point[] = [];

  // If the current point is a path, we can go in all directions
  if (map[y][x] === FieldType.Path) {
    directions.push({ x, y: y - 1 }); // top
    directions.push({ x: x + 1, y }); // right
    directions.push({ x, y: y + 1 }); // bottom
    directions.push({ x: x - 1, y }); // left
  } else {
    // If the current point is a slope, we can only go in the direction of the slope
    let nextPoint: Point;

    switch (map[y][x]) {
      case FieldType.SlopeTop:
        directions.push({ x, y: y - 1 });
        break;
      case FieldType.SlopeRight:
        directions.push({ x: x + 1, y });
        break;
      case FieldType.SlopeBottom:
        directions.push({ x, y: y + 1 });
        break;
      case FieldType.SlopeLeft:
        directions.push({ x: x - 1, y });
        break;
      default:
        throw new Error(`Unknown field type: ${map[y][x]}`);
    }
  }

  // Let's go in the available directions and find the longest path
  let maxPath = 0;

  for (const direction of directions) {
    const path = 1 + findLongestPathToTarget(map, direction, target, visited);

    if (path > maxPath) {
      maxPath = path;
    }
  }

  // We're done with the current point, let's remove it from the visited set
  visited.delete(key);

  return maxPath;
}

function printMap(map: FieldType[][]): void {
  console.log(map.map((line) => line.join("")).join("\n"));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const map = readInput(inputLines);
const startPoint: Point = {
  x: 1,
  y: 0,
};
const endPoint: Point = {
  x: map[0].length - 2,
  y: map.length - 1,
};

const visited = new Set<string>();
const longestPath = findLongestPathToTarget(map, startPoint, endPoint, visited);

console.log(`Longest path: ${longestPath}`);
