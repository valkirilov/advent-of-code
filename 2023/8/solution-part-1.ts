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
      [Direction.L]: left,
      [Direction.R]: right,
    });

    return acc;
  }, new Map<String, MapInstruction>());
}

function findPath(mapData: MapData): string[] {
  const { directions, instructions } = mapData;

  const path: string[] = [];
  let currentPosition = 'AAA';
  let currentIndex = 0;

  do {
    const direction: Direction = directions[currentIndex];
    const instruction: MapInstruction = instructions.get(currentPosition)!;
    
    currentPosition = instruction[direction];
    path.push(currentPosition);

    currentIndex = (currentIndex + 1) % directions.length;
  } while (currentPosition !== 'ZZZ')

  return path;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const path = findPath(parsedInput);

console.log(path.length);
