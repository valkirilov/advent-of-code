import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";

const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function parseInput(inputLines: string[]): [string[][], Movement[]] {
  const inputSeparator = findInputSeparator(inputLines);
  const cratesStacks = readCratesStacksInput(
    inputLines.slice(0, inputSeparator + 1)
  );
  const movements = readMovementsInput(inputLines.slice(inputSeparator + 2));

  return [cratesStacks, movements];
}

function findInputSeparator(inputLines: string[]): number {
  for (let i = 0; i < inputLines.length; i++) {
    if (inputLines[i].indexOf(" 1 ") > -1) {
      return i;
    }
  }

  return -1;
}

function readCratesStacksInput(inputLines: string[]): string[][] {
  const stackCount = findStacksCount(inputLines[inputLines.length - 1]);
  const stacks: string[][] = new Array(stackCount).fill([]).map(() => []);

  for (let lineIndex = 0; lineIndex < inputLines.length - 1; lineIndex++) {
    const line = inputLines[lineIndex];

    for (let chunkIndex = 0; chunkIndex < stackCount; chunkIndex++) {
      const chunkStart = chunkIndex * 4;
      const chunkEnd = chunkStart + 4;

      const crateCargo = line
        .slice(chunkStart, chunkEnd)
        .replace("[", "")
        .replace("]", "")
        .trim();

      if (crateCargo) {
        stacks[chunkIndex].push(crateCargo);
      }
    }
  }

  return stacks;
}

function findStacksCount(line: string): number {
  const lineCrates = line.trim().split(" ");
  const lastStackIndex = lineCrates.length - 1;
  const lastStack = lineCrates[lastStackIndex];

  return parseInt(lastStack);
}

interface Movement {
  crates: number;
  from: number;
  to: number;
}

function readMovementsInput(inputLines: string[]): Movement[] {
  return inputLines.map((line) => {
    const moveDetails = line.split(" ");

    const cratesAmount = parseInt(moveDetails[1]);
    const fromStack = parseInt(moveDetails[3]);
    const toStack = parseInt(moveDetails[5]);

    return {
      crates: cratesAmount,
      from: fromStack,
      to: toStack,
    };
  });
}

function solve(cratesStacks: string[][], movements: Movement[]): string {
  movements.forEach((movement) => {
    cratesStacks = moveCrates9001(cratesStacks, movement);
  });

  return cratesStacks.reduce((acc, stack) => {
    const topCrate = stack[0];

    return `${acc}${topCrate}`;
  }, "");
}

function moveCrates9000(
  cratesStacks: string[][],
  movement: Movement
): string[][] {
  for (let i = 0; i < movement.crates; i++) {
    cratesStacks = moveCrate9000(cratesStacks, movement.from, movement.to);
  }

  return cratesStacks;
}

function moveCrate9000(
  cratesStacks: string[][],
  fromStack: number,
  toStack: number
): string[][] {
  const crate = cratesStacks[fromStack - 1].shift()!;

  cratesStacks[toStack - 1].unshift(crate);

  return cratesStacks;
}

function moveCrates9001(
  cratesStacks: string[][],
  movement: Movement
): string[][] {
  const liftedCrates = [];

  for (let i = 0; i < movement.crates; i++) {
    const crate = cratesStacks[movement.from - 1].shift()!;
    liftedCrates.push(crate);
  }

  cratesStacks[movement.to - 1] = liftedCrates.concat(
    cratesStacks[movement.to - 1]
  );

  return cratesStacks;
}

const [cratesStacks, movements] = parseInput(inputLines);

const solution = solve(cratesStacks, movements);
console.log("Solution: %s", solution);
