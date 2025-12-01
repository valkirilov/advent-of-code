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

function moveDial(current: number, move: Move): [number, number] {
  const delta = move.direction === Direction.Left ? -move.steps : move.steps;
  const newPosition = (((current + delta) % 100) + 100) % 100;

  const distanceToFirstZero =
    move.direction === Direction.Left ? current : (100 - current) % 100;

  const zeroCrossings =
    distanceToFirstZero === 0
      ? Math.floor(move.steps / 100)
      : move.steps >= distanceToFirstZero
        ? Math.floor((move.steps - distanceToFirstZero) / 100) + 1
        : 0;

  return [newPosition, zeroCrossings];
}

function findPassword(dial: number, moves: Move[]): number {
  return moves.reduce((password, move) => {
    const [newDial, zeroCrossings] = moveDial(dial, move);
    dial = newDial;

    // Count all times we point at 0 (including ending position if it's 0)
    password += zeroCrossings;

    return password;
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);

let dial = 50;
const password = findPassword(dial, parsedInput);

console.log(password);
