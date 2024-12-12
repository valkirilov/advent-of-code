import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string[][] {
  return input.map((line) => line.split(""));
}

interface Garden {
  label: string;
  points: [number, number][];
  area?: number;
  perimeter?: number;
}

function readGardens(map: string[][]): Garden[] {
  const gardens: Garden[] = [];
  const visited = map.map((row) => row.map(() => false));

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (visited[row][col]) {
        continue;
      }

      const point = map[row][col];
      const garden = findGarden(map, [row, col], visited);

      gardens.push({
        label: point,
        points: garden,
      });
    }
  }

  return gardens;
}

function findGarden(
  map: string[][],
  point: [number, number],
  visited: boolean[][],
): [number, number][] {
  const [row, col] = point;
  const value = map[row][col];

  const garden: [number, number][] = [];
  const stack: [number, number][] = [point];

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop()!;

    if (visited[currentRow][currentCol]) {
      continue;
    }

    visited[currentRow][currentCol] = true;
    garden.push([currentRow, currentCol]);

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    directions.forEach(([dRow, dCol]) => {
      const newRow = currentRow + dRow;
      const newCol = currentCol + dCol;

      if (
        isValidPosition(map, [newRow, newCol]) &&
        map[newRow][newCol] === value &&
        !visited[newRow][newCol]
      ) {
        stack.push([newRow, newCol]);
      }
    });
  }

  return garden;
}

function calculateArea(gardens: Garden[]): Garden[] {
  return gardens.map((garden) => {
    garden.area = garden.points.length;

    return garden;
  });
}

function calculatePerimeters(map: string[][], gardens: Garden[]): Garden[] {
  return gardens.map((garden) => {
    garden.perimeter = garden.points.reduce((acc, point) => {
      return acc + calculatePointPerimeter(map, point);
    }, 0);

    return garden;
  });
}

function calculatePointPerimeter(
  map: string[][],
  point: [number, number],
): number {
  const [row, col] = point;
  const value = map[row][col];

  let perimeter = 0;

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (
      !isValidPosition(map, [newRow, newCol]) ||
      (isValidPosition(map, [newRow, newCol]) && map[newRow][newCol] !== value)
    ) {
      perimeter++;
    }
  });

  return perimeter;
}

function isValidPosition(map: string[][], point: [number, number]): boolean {
  const [row, col] = point;

  return row >= 0 && row < map.length && col >= 0 && col < map[row].length;
}

function calculatePrice(gardens: Garden[]): number {
  return gardens.reduce((acc, garden) => {
    return acc + garden.area! * garden.perimeter!;
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const map = readInput(inputLines);
let gardens = readGardens(map);
gardens = calculateArea(gardens);
gardens = calculatePerimeters(map, gardens);

const price = calculatePrice(gardens);

console.log(price);
