import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Move {
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

interface Board {
  map: string[][];
  moves: Move[];
}

function readInput(input: string[]): Board {
  const map: string[][] = [];
  const moves: Move[] = [];

  let isMap = true;
  input.forEach((line) => {
    if (line.length === 0) {
      isMap = false;
      return;
    }

    if (isMap) {
      map.push(line.split(""));
    } else {
      moves.push(...line.split("").map((move) => move as Move));
    }
  });

  return {
    map,
    moves,
  };
}

function findStartPosition(map: string[][]): [number, number] {
  let startX;
  let startY;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "@") {
        startX = x;
        startY = y;
        break;
      }
    }
  }

  return [startX, startY] as [number, number];
}

function moveRobot(board: Board, startPosition: [number, number]): Board {
  let [x, y] = startPosition;
  let [dx, dy] = [0, 0];

  board.moves.forEach((move) => {
    switch (move) {
      case Move.Up:
        dx = 0;
        dy = -1;
        break;
      case Move.Down:
        dx = 0;
        dy = 1;
        break;
      case Move.Left:
        dx = -1;
        dy = 0;
        break;
      case Move.Right:
        dx = 1;
        dy = 0;
        break;
    }

    // Verify the next move is valid

    // If next move is a wall, do nothing
    if (board.map[y + dy][x + dx] === "#") {
      return;
    }

    // If next move is an obstacle, push it
    if (board.map[y + dy][x + dx] === "O") {
      board.map = moveObstacle(board.map, x + dx, y + dy, dx, dy);
    }

    // And finally, move the robot, if possible
    if (board.map[y + dy][x + dx] === ".") {
      board.map[y][x] = ".";

      x += dx;
      y += dy;

      board.map[y][x] = "@";
    }
  });

  return board;
}

function moveObstacle(
  map: string[][],
  x: number,
  y: number,
  dx: number,
  dy: number,
): string[][] {
  // If next move is a wall, do nothing
  if (map[y + dy][x + dx] === "#") {
    return map;
  }

  // If next move is an obstacle, push it
  if (map[y + dy][x + dx] === "O") {
    map = moveObstacle(map, x + dx, y + dy, dx, dy);
  }

  // And finally, move the obstacle
  if (map[y + dy][x + dx] === ".") {
    map[y][x] = ".";
    map[y + dy][x + dx] = "O";
  }

  return map;
}

function printMap(map: string[][]): void {
  map.forEach((line) => console.log(line.join("")));
}

function calculateScore(map: string[][]): number {
  let score = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "O") {
        score += 100 * y + x;
      }
    }
  }

  return score;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const board = readInput(inputLines);
const startPosition = findStartPosition(board.map);
const finalBoardState = moveRobot(board, startPosition);
const score = calculateScore(finalBoardState.map);
console.log(score);
