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

function findPaths(mapData: MapData, startingPoints: string[]): number {
  const { directions, instructions } = mapData;

  let path = 0;
  let currentPositions: string[] = startingPoints;
  let currentDirectionIndex = 0;

  do {
    const direction: Direction = directions[currentDirectionIndex];
    const nextMoves: MapInstruction[] = getInstructions(instructions, currentPositions);
    
    currentPositions = nextMoves.map((instruction) => instruction[direction]);
    path++;

    currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;

    if (path === 1000000) {
        console.log('Reached 1M')
    } else if (path === 10000000) {
        console.log('Reached 10M')
    } else if (path === 100000000) {
        console.log('Reached 100M')
    } else if (path === 1000000000) {
        console.log('Reached 1B')
    } else if (path === 10000000000) {
        console.log('Reached 10B')
    } else if (path === 100000000000) {
        console.log('Reached 100B')
    } else if (path === 1000000000000) {
        console.log('Reached 1T')
    } else if (path === 10000000000000) {
        console.log('Reached 10T')
    }

    if (path > 13385272668820) {
        console.log(currentPositions)
    }

    if (path > 13385272668829) {
        break;
    }
  } while (!isEndOfPath(currentPositions))

  return path;
}

function getInstructions(instructions: Map<String, MapInstruction>, currentPositions: string[]): MapInstruction[] {
  return currentPositions.map(position => instructions.get(position)!);
}

function isEndOfPath(positions: string[]): boolean {
  return positions.every(position => position.endsWith('Z'));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const startingPoints = findStartingPoints(parsedInput);
const paths = findPaths(parsedInput, startingPoints);

console.log(paths);
