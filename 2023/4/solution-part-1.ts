import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Game {
  round: number;
  winningNumbers: number[];
  drawNumbers: number[];
  points: number;
}

function readInput(input: string[]): Game[] {
  return input.map((line) => parseGame(line));
}

function parseGame(line: string): Game {
  const round = parseGameRound(line);
  const { winningNumbers, drawNumbers} = parseGameNumbers(line);

  return {
    round,
    winningNumbers,
    drawNumbers,
    points: 0,
  };
}

function parseGameRound(line: string): number {
  const [round] = line.split(":");
  const [_, roundNumber] = round.split(" ");

  return parseInt(roundNumber);
}

function parseGameNumbers(line: string): Pick<Game, "winningNumbers" | "drawNumbers"> {
  const [, numbers] = line.split(": ");
  const [winningNumbersString, drawNumbersString] = numbers.split(" | ");
  const winningNumbers = winningNumbersString.split(" ").filter(Boolean).map((n) => parseInt(n));
  const drawNumbers = drawNumbersString.split(" ").filter(Boolean).map((n) => parseInt(n));

  return {
    winningNumbers,
    drawNumbers,
  };
}

function calculateGamesPoints(games: Game[]): Game[] {
  return games.map((game) => {
    const points = calculateGamePoints(game);
    
    return {
      ...game,
      points,
    };
  });
}

function calculateGamePoints(game: Game): number {
  const { winningNumbers, drawNumbers } = game;
  const matchingNumbers = winningNumbers.filter((n) => drawNumbers.includes(n));

  if (matchingNumbers.length > 0) {
    return Math.pow(2, matchingNumbers.length-1);
  }
  
  return 0;
}

function calculateGameScore(games: Game[]): number {
  return games.reduce((acc, game) => acc + game.points, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const gamesWithPoints = calculateGamesPoints(parsedInput);
const gameScore = calculateGameScore(gamesWithPoints);

console.log(gameScore);
