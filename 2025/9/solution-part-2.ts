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

function generateContour(points: Point[]): Set<string> {
  const contourSet = new Set<string>();

  points.forEach((point) => contourSet.add(`${point.x},${point.y}`));

  for (let i = 0; i < points.length; i++) {
    const point1 = points[i];
    const point2 = points[(i + 1) % points.length];

    if (point1.x === point2.x) {
      // Vertical line
      const minY = Math.min(point1.y, point2.y);
      const maxY = Math.max(point1.y, point2.y);
      for (let y = minY; y <= maxY; y++) {
        contourSet.add(`${point1.x},${y}`);
      }
    } else if (point1.y === point2.y) {
      // Horizontal line
      const minX = Math.min(point1.x, point2.x);
      const maxX = Math.max(point1.x, point2.x);
      for (let x = minX; x <= maxX; x++) {
        contourSet.add(`${x},${point1.y}`);
      }
    }
  }

  return contourSet;
}

function isPointInsidePolygon(point: Point, points: Point[]): boolean {
  let intersections = 0;

  for (let i = 0; i < points.length; i++) {
    const point1 = points[i];
    const point2 = points[(i + 1) % points.length];

    // Skip horizontal edges
    if (point1.y === point2.y) {
      continue;
    }

    const minY = Math.min(point1.y, point2.y);
    const maxY = Math.max(point1.y, point2.y);

    // Check if point is in vertical range of edge
    if (point.y < minY || point.y >= maxY) {
      continue;
    }

    // Calculate x coordinate where ray intersects edge
    const intersectX =
      point1.x +
      ((point.y - point1.y) * (point2.x - point1.x)) / (point2.y - point1.y);

    // Count if intersection is to the right of point
    if (point.x < intersectX) {
      intersections++;
    }
  }

  return intersections % 2 === 1;
}

function isRectangleValid(
  rect: Rectangle,
  points: Point[],
  contourSet: Set<string>,
): boolean {
  const minX = Math.min(rect.topLeft.x, rect.bottomRight.x);
  const maxX = Math.max(rect.topLeft.x, rect.bottomRight.x);
  const minY = Math.min(rect.topLeft.y, rect.bottomRight.y);
  const maxY = Math.max(rect.topLeft.y, rect.bottomRight.y);

  // Top and bottom edges
  for (let x = minX; x <= maxX; x++) {
    for (const y of [minY, maxY]) {
      if (!isPointInsideOrOnPolygon({ x, y }, points, contourSet)) {
        return false;
      }
    }
  }

  // Left and right edges
  for (let y = minY; y <= maxY; y++) {
    for (const x of [minX, maxX]) {
      if (!isPointInsideOrOnPolygon({ x, y }, points, contourSet)) {
        return false;
      }
    }
  }

  return true;
}

function isPointInsideOrOnPolygon(
  point: Point,
  points: Point[],
  contourSet: Set<string>,
): boolean {
  const key = `${point.x},${point.y}`;

  return contourSet.has(key) || isPointInsidePolygon(point, points);
}

function findLargestRectangle(
  points: Point[],
  contourSet: Set<string>,
): Rectangle | null {
  console.log(`Checking rectangles from ${points.length} points...`);

  let maxArea = 0;
  let bestRect: Rectangle | null = null;
  let checked = 0;
  const total = (points.length * (points.length - 1)) / 2;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      checked++;

      if (checked % 10000 === 0) {
        console.log(
          `Progress: ${checked}/${total} (${((checked / total) * 100).toFixed(
            1,
          )}%) - Best: ${maxArea}`,
        );
      }

      const point1 = points[i];
      const point2 = points[j];

      const width = Math.abs(point1.x - point2.x) + 1;
      const height = Math.abs(point1.y - point2.y) + 1;
      const area = width * height;

      if (area <= maxArea) {
        continue;
      }

      const rect: Rectangle = { topLeft: point1, bottomRight: point2, area };

      if (isRectangleValid(rect, points, contourSet)) {
        maxArea = area;
        bestRect = rect;
        console.log(`New best rectangle! Area: ${maxArea}`);
      }
    }
  }

  return bestRect;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const points = readInput(inputLines);
const contourSet = generateContour(points);
const bestRectangle = findLargestRectangle(points, contourSet);
console.log("\nLargest rectangle:", bestRectangle);
console.log("Answer:", bestRectangle?.area);

// 1552139370
