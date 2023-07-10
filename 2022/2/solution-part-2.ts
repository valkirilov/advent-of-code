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
  Rock = "Rock",
  Paper = "Paper",
  Scissors = "Scissors",
}

enum PlayerMoveSuggestion {
  X = "Lose",
  Y = "Draw",
  Z = "Win",
}

interface Round {
  opponentMove: OpponentMove;
  playerMove?: PlayerMove;
  playerMoveSuggestion: PlayerMoveSuggestion;
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
    const [opponentMove, playerMoveSuggestion] = line.split(" ");

    rounds.push({
      opponentMove: OpponentMove[opponentMove as keyof typeof OpponentMove],
      playerMoveSuggestion:
        PlayerMoveSuggestion[
          playerMoveSuggestion as keyof typeof PlayerMoveSuggestion
        ],
    });
  });

  return rounds;
}

function playGame(rounds: Round[]): number {
  let playerScore = 0;

  rounds.forEach((round) => {
    const winner = getWinner(round);
    const finishedRound = decideRoundMove(round, winner);
    const roundScore = getRoundScore(finishedRound, winner);

    playerScore += roundScore;
  });

  return playerScore;
}

function getWinner(round: Round): RoundWinner {
  switch (round.playerMoveSuggestion) {
    case PlayerMoveSuggestion.X:
      return RoundWinner.Opponent;
    case PlayerMoveSuggestion.Y:
      return RoundWinner.Draw;
    case PlayerMoveSuggestion.Z:
      return RoundWinner.Player;
  }
}

function decideRoundMove(round: Round, winner: RoundWinner): Round {
  let playerMove;

  switch (winner) {
    case RoundWinner.Draw:
      playerMove = decidePlayerMoveDraw(round.opponentMove);
      break;
    case RoundWinner.Opponent:
      playerMove = decidePlayerMoveLose(round.opponentMove);
      break;
    case RoundWinner.Player:
      playerMove = decidePlayerMoveWin(round.opponentMove);
      break;
  }

  return {
    ...round,
    playerMove,
  };
}

function decidePlayerMoveDraw(opponentMove: OpponentMove): PlayerMove {
  return PlayerMove[opponentMove];
}

function decidePlayerMoveLose(opponentMove: OpponentMove): PlayerMove {
  switch (opponentMove) {
    case OpponentMove.Rock:
      return PlayerMove.Scissors;
    case OpponentMove.Paper:
      return PlayerMove.Rock;
    case OpponentMove.Scissors:
      return PlayerMove.Paper;
  }
}

function decidePlayerMoveWin(opponentMove: OpponentMove): PlayerMove {
  switch (opponentMove) {
    case OpponentMove.Rock:
      return PlayerMove.Paper;
    case OpponentMove.Paper:
      return PlayerMove.Scissors;
    case OpponentMove.Scissors:
      return PlayerMove.Rock;
  }
}

function getRoundScore(round: Round, winner: RoundWinner): number {
  const winnerScore = RoundScore[winner as keyof typeof RoundScore];
  const shapeScore = ShapeScore[round.playerMove as keyof typeof ShapeScore];

  return winnerScore + shapeScore;
}

const rounds = readInput(inputLines);

// Part 2
const score = playGame(rounds);
console.log("Score: ", score);
