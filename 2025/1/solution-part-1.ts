import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Direction {
  Left = "L",
  Right = "R",
}

interface Move {
  direction: "L" | "R";
  steps: number;
}

function readInput(input: string[]): Move[] {
  return input.map(parseMove);
}

function parseMove(line: string): Move {
  const direction = line.charAt(0) as Direction;
  const steps = parseInt(line.slice(1), 10);

  return { direction, steps };
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function moveDial(current: number, move: Move): number {
  if (move.direction === Direction.Left) {
    return mod(current - move.steps, 100);
  } else {
    return mod(current + move.steps, 100);
  }
}

function findPassword(dial: number, moves: Move[]): number {
  return moves.reduce((password, move) => {
    dial = moveDial(dial, move);

    if (dial === 0) {
      password++;
    }

    return password;
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);

let dial = 50;
const password = findPassword(dial, parsedInput);

console.log(password);
