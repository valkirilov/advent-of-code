import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Hailstone {
  position: Point;
  velocity: Point;
  standardForm: StandardForm;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

interface StandardForm {
  a: number;
  b: number;
  c: number;
}

function readInput(input: string[]): Hailstone[] {
  return input.map(parseHailstone);
}

function parseHailstone(input: string): Hailstone {
  const [position, velocity] = input.split(" @ ");
  const [pX, pY, pZ] = position.split(",").map(Number);
  const [vX, vY, vZ] = velocity.split(": ")[0].split(",").map(Number);

  const a = vY;
  const b = -vX;
  const c = vY * pX - vX * pY;

  return {
    position: { x: pX, y: pY, z: pZ },
    velocity: { x: vX, y: vY, z: vZ },
    standardForm: { a, b, c },
  };
}

interface Intersection {
  point: Point;
  hailstones: [Hailstone, Hailstone];
}

function findIntersections(hailstones: Hailstone[]): Intersection[] {
  const intersections: Intersection[] = [];

  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const intersection = findIntersection(hailstones[i], hailstones[j]);
      if (intersection) {
        intersections.push(intersection);
      }
    }
  }

  return intersections;
}

function findIntersection(
  hailstone1: Hailstone,
  hailstone2: Hailstone,
): Intersection | undefined {
  const { a: a1, b: b1, c: c1 } = hailstone1.standardForm;
  const { a: a2, b: b2, c: c2 } = hailstone2.standardForm;

  // If the lines are parallel, there is no intersection
  if (a1 * b2 === b1 * a2) {
    return undefined;
  }

  // Now, we have to solve the system of equations to find the intersection point
  const x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
  const y = (c2 * a1 - c1 * a2) / (a1 * b2 - a2 * b1);

  // We have to check that the intersection point is inside the allowed range
  if (
    x < MIN_POSITION ||
    x > MAX_POSITION ||
    y < MIN_POSITION ||
    y > MAX_POSITION
  ) {
    return undefined;
  }

  // We have to check that the intersection point is on the lines
  if (
    (x - hailstone1.position.x) * hailstone1.velocity.x >= 0 &&
    (y - hailstone1.position.y) * hailstone1.velocity.y >= 0 &&
    (x - hailstone2.position.x) * hailstone2.velocity.x >= 0 &&
    (y - hailstone2.position.y) * hailstone2.velocity.y >= 0
  ) {
    return {
      point: { x, y, z: 0 },
      hailstones: [hailstone1, hailstone2],
    };
  }

  return undefined;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

// const MIN_POSITION = 7;
// const MAX_POSITION = 27;
const MIN_POSITION = 200000000000000;
const MAX_POSITION = 400000000000000;

const hailstones = readInput(inputLines);
const intersections = findIntersections(hailstones);

console.log(intersections.length);

// too low 10360
