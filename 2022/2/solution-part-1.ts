import * as fs from "fs";
import { get } from "http";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";

const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum OpponentMove {
  A = "Rock",
  B = "Paper",
  C = "Scissors",

  // It's ugly, but let's make it easier for me to verify the turns
  Rock = "Rock",
  Paper = "Paper",
  Scissors = "Scissors",
}

enum PlayerMove {
  X = "Rock",
  Y = "Paper",
  Z = "Scissors",
  Rock = "Rock",
  Paper = "Paper",
  Scissors = "Scissors",
}

interface Round {
  opponentMove: OpponentMove;
  playerMove: PlayerMove;
}

enum RoundWinner {
  Opponent = "Opponent",
  Player = "Player",
  Draw = "Draw",
}

enum ShapeScore {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

enum RoundScore {
  Player = 6,
  Draw = 3,
  Opponent = 0,
}

function readInput(input: string[]): Round[] {
  const rounds: Round[] = [];

  input.forEach((line) => {
    const [opponentMove, playerMove] = line.split(" ");

    rounds.push({
      opponentMove: OpponentMove[opponentMove as keyof typeof OpponentMove],
      playerMove: PlayerMove[playerMove as keyof typeof PlayerMove],
    });
  });

  return rounds;
}

function playGame(rounds: Round[]): number {
  let playerScore = 0;

  rounds.forEach((round) => {
    const winner = getWinner(round);
    const roundScore = getRoundScore(round, winner);

    playerScore += roundScore;
  });

  return playerScore;
}

function getWinner(round: Round): RoundWinner {
  if (
    (round.opponentMove === OpponentMove.Rock &&
      round.playerMove === PlayerMove.Scissors) ||
    (round.opponentMove === OpponentMove.Paper &&
      round.playerMove === PlayerMove.Rock) ||
    (round.opponentMove === OpponentMove.Scissors &&
      round.playerMove === PlayerMove.Paper)
  ) {
    return RoundWinner.Opponent;
  }

  if (
    (round.playerMove === PlayerMove.Rock &&
      round.opponentMove === OpponentMove.Scissors) ||
    (round.playerMove === PlayerMove.Paper &&
      round.opponentMove === OpponentMove.Rock) ||
    (round.playerMove === PlayerMove.Scissors &&
      round.opponentMove === OpponentMove.Paper)
  ) {
    return RoundWinner.Player;
  }

  return RoundWinner.Draw;
}

function getRoundScore(round: Round, winner: RoundWinner): number {
  const winnerScore = RoundScore[winner as keyof typeof RoundScore];
  const shapeScore = ShapeScore[round.playerMove as keyof typeof ShapeScore];

  return winnerScore + shapeScore;
}

const rounds = readInput(inputLines);

// Part 1
const score = playGame(rounds);
console.log("Score: ", score);
