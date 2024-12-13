import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const MAX_ITERATIONS = 1000;
const BUTTON_A_PRICE = 3;
const BUTTON_B_PRICE = 1;

interface Button {
  xOffset: number;
  yOffset: number;
}

interface Gamepad {
  buttonA: Button;
  buttonB: Button;
  prize: [number, number];
}

function readInput(input: string[]): Gamepad[] {
  const gamepads: Gamepad[] = [];

  let currentGamepad: Gamepad = {
    buttonA: { xOffset: 0, yOffset: 0 },
    buttonB: { xOffset: 0, yOffset: 0 },
    prize: [0, 0],
  };

  input.forEach((line, index) => {
    if ((index + 1) % 4 === 0) {
      if (index > 0) {
        gamepads.push(currentGamepad);
      }

      currentGamepad = {
        buttonA: { xOffset: 0, yOffset: 0 },
        buttonB: { xOffset: 0, yOffset: 0 },
        prize: [0, 0],
      };
    } else if ((index + 1) % 4 === 1) {
      const [_, button] = line.split(": ");
      const [xOffset, yOffset] = button.split(", ");

      currentGamepad.buttonA = {
        xOffset: Number(xOffset.replace("X+", "")),
        yOffset: Number(yOffset.replace("Y+", "")),
      };
    } else if ((index + 1) % 4 === 2) {
      const [_, button] = line.split(": ");
      const [xOffset, yOffset] = button.split(", ");

      currentGamepad.buttonB = {
        xOffset: Number(xOffset.replace("X+", "")),
        yOffset: Number(yOffset.replace("Y+", "")),
      };
    } else if ((index + 1) % 4 === 3) {
      const [_, prize] = line.split(": ");
      const [x, y] = prize.split(", ");

      currentGamepad.prize = [
        Number(x.replace("X=", "")),
        Number(y.replace("Y=", "")),
      ];
    }
  });

  gamepads.push(currentGamepad!);

  return gamepads;
}

function findBestMoves(gamepads: Gamepad[]): number[] {
  return gamepads.map(findGamepadBestMove);
}

function findGamepadBestMove(gamepad: Gamepad): number {
  const { buttonA, buttonB, prize } = gamepad;
  const prices: number[] = [];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    for (let j = 0; j < MAX_ITERATIONS; j++) {
      const x = i * buttonA.xOffset + j * buttonB.xOffset;
      const y = i * buttonA.yOffset + j * buttonB.yOffset;

      if (x === prize[0] && y === prize[1]) {
        const price = i * BUTTON_A_PRICE + j * BUTTON_B_PRICE;

        if (isFinite(price)) {
          prices.push(price);
        }
      }
    }
  }

  if (prices.length === 0) {
    return 0;
  }

  return Math.min(...prices);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const gamepads = readInput(inputLines);
const moves = findBestMoves(gamepads);
const price = moves.reduce((acc, move) => acc + move, 0);
console.log(price);
