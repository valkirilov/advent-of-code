import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Direction {
  L = "L",
  R = "R",
}

interface MapData {
  directions: Direction[];
  instructions: Map<String, MapInstruction>;
}

interface MapInstruction {
  [Direction.L]: string;  
  [Direction.R]: string;
}

function readInput(input: string[]): MapData {
  const directions = input[0].split("") as Direction[];
  const instructions = parseInstructions(input.slice(2));

  return {
    directions,
    instructions
  };
}

function parseInstructions(input: string[]): Map<String, MapInstruction> {
  return input.reduce((acc: any, line) => {
    const [destination, instructions] = line.split(" = ");
    const [left, right] = instructions.replace('(', '').replace(')', '').split(", ");

    acc.set(destination, {
      [Direction.L]: left.trim(),
      [Direction.R]: right.trim(),
    });

    return acc;
  }, new Map<String, MapInstruction>());
}

function findStartingPoints(mapData: MapData): string[] {
  const { instructions } = mapData;

  return Array.from(instructions.keys()).filter((key) => {
    return key.endsWith('A');
  }).map(key => key.toString());
}

function findPaths(mapData: MapData, startingPoints: string[]): number[] {
  const { directions, instructions } = mapData;

  let currentPositions: string[] = startingPoints;
  let currentDirectionIndex = 0;

  let pathsFound: boolean[] = currentPositions.map((position) => false);
  let paths: number[] = currentPositions.map((position) => 0);

  do {
    const direction: Direction = directions[currentDirectionIndex];
    const nextMoves: MapInstruction[] = getInstructions(instructions, currentPositions);
        
    currentPositions = nextMoves.map((instruction) => instruction[direction]);

    // Let's find the paths that have reached the end
    currentPositions.forEach((position, index) => {
      if (!pathsFound[index]) {
        if (position.endsWith('Z')) {
          pathsFound[index] = true;
        }
        paths[index]++;
      }
    })

    currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
  } while (!pathsFound.every((found) => found))

  return paths;
}

function getInstructions(instructions: Map<String, MapInstruction>, currentPositions: string[]): MapInstruction[] {
  return currentPositions.map(position => instructions.get(position)!);
}

function findLeastCommonMultiplier(numbers: number[]): number {
  return numbers.reduce((acc, number) => {
    return lcm(acc, number);
  }, numbers[0]);
}

function lcm(a: number, b: number): number {
  return a * b / gcd(a, b);
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const startingPoints = findStartingPoints(parsedInput);
const paths = findPaths(parsedInput, startingPoints);
const answer = findLeastCommonMultiplier(paths);

console.log(answer);
