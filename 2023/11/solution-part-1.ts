import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

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

function enlarge(universe: Universe): Universe {
  const { map } = universe;
  const enlargedUniverse: SpaceObject[][] = [];

  // First, go through all rows and duplicate those that don't have a galaxy
  for (const row of map) {
    if (row.some((char) => char === SpaceObject.Galaxy)) {
      enlargedUniverse.push([...row]);
    } else {
      enlargedUniverse.push([...row]);
      enlargedUniverse.push([...row]);
    }
  }

  // Then, go through all columns and duplicate those that don't have a galaxy
  const isEmptyColumns = new Array(enlargedUniverse[0].length).fill(true);
  for (let y = 0; y < enlargedUniverse.length; y++) {
    for (let x = 0; x < enlargedUniverse[y].length; x++) {
      if (enlargedUniverse[y][x] === SpaceObject.Galaxy) {
        isEmptyColumns[x] = false;
      }
    }
  }

  // Apply the column duplication first to avoid messing up the rows
  for (let x = 0; x < isEmptyColumns.length; x++) {
    if (isEmptyColumns[x]) {
      // Also, we need to update the isEmptyColumns array
      isEmptyColumns.splice(x + 1, 0, false);
    }
  }

  // And finally, duplicate the columns that don't have a galaxy
  let y = 0;
  while (y < enlargedUniverse.length) {
    let x = 0;

    while (x < isEmptyColumns.length) {
      if (isEmptyColumns[x]) {
        // Push new empty column to the left of the current one
        enlargedUniverse[y].splice(x, 0, SpaceObject.Empty);
      }

      x++;
    }

    y++;
  }

  return { map: enlargedUniverse };
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
  const { map, distances } = universe;

  if (!distances) {
    throw new Error("Distances not found");
  }

  for (const distance of distances) {
    const { start, end } = distance;
    const distanceValue = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);

    distance.distance = distanceValue;
  }

  return {
    ...universe,
    distances,
  };
}

function sumDistances(distances: Distance[]): number {
  return distances.reduce((sum, distance) => {
    if (!distance.distance) {
      throw new Error("Distance not found");
    }

    return sum + distance.distance;
  }, 0);
}

function printUniverse(universe: Universe): void {
  console.log(
    universe.map.map((line) => line.map((char) => char).join("")).join("\n"),
  );
}

function printVisited(visited: number[][]): void {
  console.log(
    visited
      .map((line) => line.map((char) => char.toString().padStart(3)).join(""))
      .join("\n"),
  );
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const enlargedUniverse = enlarge(parsedInput);
const universeWithGalaxies = findGalaxies(enlargedUniverse);
const universeWithDistancesPairs = generateDistancesPairs(universeWithGalaxies);
const universeWithDistances = calculateDistances(universeWithDistancesPairs);
const distances = sumDistances(universeWithDistances.distances!);

console.log("Distances:");
console.log(universeWithDistances.distances);

console.log(distances);
