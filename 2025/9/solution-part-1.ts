import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Point {
  x: number;
  y: number;
}

interface Rectangle {
  topLeft: Point;
  bottomRight: Point;
  area: number;
}

function readInput(input: string[]): Point[] {
  return input.map(parseInput);
}

function parseInput(input: string): Point {
  const [x, y] = input.split(",").map(Number);

  return { x, y };
}

function getAllRectangles(points: Point[]): Rectangle[] {
  const rectangles: Rectangle[] = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = calculateArea(points[i], points[j]);
      rectangles.push({
        topLeft: points[i],
        bottomRight: points[j],
        area: distance,
      });
    }
  }

  rectangles.sort((a, b) => b.area - a.area);

  return rectangles;
}

function calculateArea(p1: Point, p2: Point): number {
  const width = Math.abs(p1.x - p2.x) + 1;
  const height = Math.abs(p1.y - p2.y) + 1;

  return width * height;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const rectangles = getAllRectangles(parsedInput);
console.log(rectangles[0].area);
