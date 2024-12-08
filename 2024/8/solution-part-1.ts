import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

function findAntennas(map: string[][]): Map<string, [number, number][]> {
  const antennas = new Map<string, [number, number][]>();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const symbol = map[y][x];

      if (symbol !== ".") {
        if (!antennas.has(symbol)) {
          antennas.set(symbol, []);
        }

        antennas.get(symbol)!.push([x, y]);
      }
    }
  }

  return antennas;
}

function findAntiNodes(
  map: string[][],
  antennas: Map<string, [number, number][]>,
): Set<string> {
  const antiNodes: Set<string> = new Set();

  // Iterate over all antennas and check each pair
  antennas.forEach((positions) => {
    // Check each pair of antennas
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [x1, y1] = positions[i];
        const [x2, y2] = positions[j];

        const antiNode1X = 2 * x1 - x2;
        const antiNode1Y = 2 * y1 - y2;

        if (isPositionValid(map, antiNode1X, antiNode1Y)) {
          antiNodes.add(`${antiNode1X},${antiNode1Y}`);
        }

        const antiNode2X = 2 * x2 - x1;
        const antiNode2Y = 2 * y2 - y1;

        if (isPositionValid(map, antiNode2X, antiNode2Y)) {
          antiNodes.add(`${antiNode2X},${antiNode2Y}`);
        }
      }
    }
  });

  return antiNodes;
}

function isPositionValid(map: string[][], x: number, y: number): boolean {
  return y >= 0 && y < map.length && x >= 0 && x < map[0].length;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const map = readInput(inputLines);
const antennas = findAntennas(map);
const antiNodes = findAntiNodes(map, antennas);

console.log(antiNodes.size);

// 331 too low
// 355 too high
