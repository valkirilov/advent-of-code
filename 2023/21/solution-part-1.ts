import * as fs from "fs";
import { find } from "lodash";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum FieldType {
  Garden = ".",
  Rock = "#",
  Start = "S",
}

interface Point {
  x: number;
  y: number;
}

function readInput(input: string[]): FieldType[][] {
  return input.map((line) => line.split("") as FieldType[]);
}

function findStartPoint(map: FieldType[][]): Point {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf(FieldType.Start);
    if (map[y][x] === FieldType.Start) {
      return { x, y };
    }
  }

  throw new Error("Start point not found");
}

function printMap(map: FieldType[][], points: Point[] = []): void {
  // Dump all lines of the map, but if there is a point with the exact coordinated dump O instead
  for (let y = 0; y < map.length; y++) {
    const line = map[y].map((field, x) => {
      const point = find(points, { x, y });
      return point ? "O" : field;
    });
    console.log(line.join(""));
  }
}

function findNextSteps(map: FieldType[][], points: Point[]): Point[] {
  const nextSteps: Point[] = [];

  points.forEach((point) => {
    const neighbors = getPossibleNeighbors(map, point);

    // Add the possible neighbors to the list of next steps (if they are not already in the list)
    neighbors.forEach((neighbor) => {
      if (!find(nextSteps, neighbor)) {
        nextSteps.push(neighbor);
      }
    });
  });

  return nextSteps;
}

function getPossibleNeighbors(map: FieldType[][], point: Point): Point[] {
  const neighbors: Point[] = [];

  const directions: Point[] = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
  ];

  directions.forEach((direction) => {
    const { x, y } = point;
    const { x: dx, y: dy } = direction;
    const neighbor: Point = { x: x + dx, y: y + dy };

    // If the neighbor is out of bounds, we need to loop back to the other side of the map
    if (
      neighbor.x < 0 ||
      neighbor.x >= map[0].length ||
      neighbor.y < 0 ||
      neighbor.y >= map.length
    ) {
      return;
    }

    // If the neighbor is a rock, skip it
    if (map[neighbor.y][neighbor.x] === FieldType.Rock) {
      return;
    }

    // Otherwise, add it to the list of neighbors
    neighbors.push(neighbor);
  });

  return neighbors;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const STEPS = 64;

const map = readInput(inputLines);
const startPoint = findStartPoint(map);
// printMap(map, [startPoint]);

let steps = [startPoint];
for (let i = 0; i < STEPS; i++) {
  steps = findNextSteps(map, steps);
}

console.log(`Step ${STEPS}: ${steps.length} gardens`);
// printMap(map, steps);
