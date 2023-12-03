import * as fs from "fs";
import { parse } from "path";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

// Setup base constants
const BAG_RED_CUBES = 12;
const BAG_GREEN_CUBES = 13;
const BAG_BLUE_CUBES = 14;

interface Game {
  gameId: number;
  redSet: number;
  blueSet: number;
  greenSet: number;
}

function readInput(input: string[]): Game[] {
  return input.map(parseGame);
}

function parseGame(input: string): Game {
  const gameId = parseGameId(input);
  const [redSet, greenSet, blueSet] = parseGameSets(input);

  return {
    gameId,
    redSet,
    blueSet,
    greenSet,
  };
}

function parseGameId(input: string): number {
  const [gameString] = input.split(": ");
  const [_, gameId] = gameString.split(" ");

  return parseInt(gameId);
}

function parseGameSets(input: string): number[] {
  const [_, setsString] = input.split(": ");
  const sets = setsString.split("; ");

  return sets.reduce(
    (acc: any, curr) => {
      const [red, green, blue] = parseGameSet(curr);

      if (red > acc[0]) {
        acc[0] = red;
      }
      if (green > acc[1]) {
        acc[1] = green;
      }
      if (blue > acc[2]) {
        acc[2] = blue;
      }

      return acc;
    },
    [0, 0, 0],
  );
}

function parseGameSet(set: string): number[] {
  return set
    .split(", ")
    .map(parseSetDraw)
    .reduce(
      (acc: any, curr: [string, number]) => {
        const [red, green, blue] = acc;
        const [type, value] = curr;
        if (type === "red") {
          return [value, green, blue];
        } else if (type === "green") {
          return [red, value, blue];
        } else if (type === "blue") {
          return [red, green, value];
        }
      },
      [0, 0, 0],
    );
}

function parseSetDraw(setDraw: string): [string, number] {
  const [value, type] = setDraw.split(" ");

  return [type.replace("\r", ""), parseInt(value)];
}

function findGamesMinimumRequirements(games: Game[]): number[] {
  return games.map(calculateMinimumRequirementsProduct);
}

function calculateMinimumRequirementsProduct(game: Game): number {
  const { redSet, greenSet, blueSet } = game;

  return redSet * greenSet * blueSet;
}

function calculateGameScore(games: number[]): number {
  return games.reduce((acc, curr) => acc + curr, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const minimumRequirements = findGamesMinimumRequirements(parsedInput);
const score = calculateGameScore(minimumRequirements);

console.log(score);
