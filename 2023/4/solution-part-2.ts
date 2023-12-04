import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Game {
  round: number;
  winningNumbers: number[];
  drawNumbers: number[];
  matches: number[];
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
    matches: [],
    points: 0,
  };
}

function parseGameRound(line: string): number {
  const [round] = line.split(":");
  const [_, ...roundNumber] = round.split(" ");

  return parseInt(roundNumber.filter(Boolean).join(""));
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
    const { points, matches } = calculateGamePoints(game);
    
    return {
      ...game,
      points,
      matches
    };
  });
}

function calculateGamePoints(game: Game): Pick<Game, "matches" | "points"> {
  const { winningNumbers, drawNumbers } = game;
  const matches = winningNumbers.filter((n) => drawNumbers.includes(n));
  
  let points = 0;
  if (matches.length > 0) {
    points = Math.pow(2, matches.length-1);
  }
  
  return {
    matches,
    points,
  };
}

function evaluateGames(games: Game[]): Game[] {
  const gamesToReturn: Game[] = []; 
  
  let gamesToProcess = games.slice();
  while (gamesToProcess.length > 0) {
    const game = gamesToProcess.shift() as Game;
    
    // Save the current game
    gamesToReturn.push(game);
    
    if (game.points === 0) {
      continue;
    }
    
    // And also, add the next games based on the current game points
    const nextGames = games.slice(game.round, game.round + game.matches.length);

    // Add the next games to the beginning of the queue
    gamesToProcess.unshift(...nextGames);
  }

  return gamesToReturn
}


// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const gamesWithPoints = calculateGamesPoints(parsedInput);
const games = evaluateGames(gamesWithPoints);

console.log(games.length);
