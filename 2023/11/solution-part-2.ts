import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const EXPANSION_FACTOR = 1000000;

enum SpaceObject {
  Empty = ".",
  Galaxy = "#",
}

interface Point {
  x: number;
  y: number;
}

interface Universe {
  map: SpaceObject[][];
  galaxies?: Point[];
  emptyRows?: number[];
  emptyColumns?: number[];
  distances?: Distance[];
}

interface Distance {
  start: Point;
  end: Point;
  distance?: number;
}

function readInput(input: string[]): Universe {
  const map = input.map((line) =>
    line.split("").map((char) => char as SpaceObject),
  );

  return {
    map,
  };
}

function findEmptySpace(universe: Universe): Universe {
  const { map } = universe;

  // First, go through all rows and find those that don't have a galaxy
  const emptyRows = [];
  for (let y = 0; y < map.length; y++) {
    if (map[y].every((char) => char === SpaceObject.Empty)) {
      emptyRows.push(y);
    }
  }

  // Columns behave differently than rows, so we need to mark them differently
  const isEmptyColumns = new Array(map[0].length).fill(true);
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === SpaceObject.Galaxy) {
        isEmptyColumns[x] = false;
      }
    }
  }

  // Let's make it in the same format as rows
  const emptyColumns = isEmptyColumns
    .map((isEmpty, index) => (isEmpty ? index : null))
    .filter((index) => index !== null) as number[];

  return { ...universe, emptyRows, emptyColumns };
}

function findGalaxies(universe: Universe): Universe {
  const { map } = universe;
  const galaxies: Point[] = [];

  // Go through all rows and columns and find galaxies
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === SpaceObject.Galaxy) {
        galaxies.push({ x, y });
      }
    }
  }

  return {
    ...universe,
    galaxies,
  };
}

function generateDistancesPairs(universe: Universe): Universe {
  const { galaxies } = universe;
  const distances = [];

  if (!galaxies) {
    throw new Error("Galaxies not found");
  }

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const start = galaxies[i];
      const end = galaxies[j];

      const distancePair = {
        start,
        end,
      };

      distances.push(distancePair);
    }
  }

  return {
    ...universe,
    distances,
  };
}

function calculateDistances(universe: Universe): Universe {
  const { distances } = universe;

  if (!distances) {
    throw new Error("Distances not found");
  }

  for (const distance of distances) {
    const { start, end } = distance;

    distance.distance = calculateDistance(universe, start, end);
  }

  return {
    ...universe,
    distances,
  };
}

function calculateDistance(
  universe: Universe,
  start: Point,
  end: Point,
): number {
  const { emptyRows, emptyColumns } = universe;

  const startX = Math.min(start.x, end.x);
  const endX = Math.max(start.x, end.x);

  const startY = Math.min(start.y, end.y);
  const endY = Math.max(start.y, end.y);

  let distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);

  // And add the distance for each empty space in between, scaled by the expansion factor
  for (let y = startY; y < endY; y++) {
    if (emptyRows?.includes(y)) {
      distance += EXPANSION_FACTOR - 1;
    }
  }

  for (let x = startX; x < endX; x++) {
    if (emptyColumns?.includes(x)) {
      distance += EXPANSION_FACTOR - 1;
    }
  }

  return distance;
}

function sumDistances(distances: Distance[]): number {
  return distances.reduce((sum, distance) => {
    if (!distance.distance) {
      throw new Error("Distance not found");
    }

    return sum + distance.distance;
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const universe = readInput(inputLines);
const enlargedUniverse = findEmptySpace(universe);
const universeWithGalaxies = findGalaxies(enlargedUniverse);
const universeWithDistancesPairs = generateDistancesPairs(universeWithGalaxies);
const universeWithDistances = calculateDistances(universeWithDistancesPairs);
const distances = sumDistances(universeWithDistances.distances!);

console.log(distances);
