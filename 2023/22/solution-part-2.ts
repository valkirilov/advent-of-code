import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

type Brick = [[number, number, number], [number, number, number]];

function readInput(input: string[]): Array<Brick> {
  return input.map((line) => {
    const [start, end] = line.split("~");
    const [startX, startY, startZ] = start.split(",").map(Number);
    const [endX, endY, endZ] = end.split(",").map(Number);

    return [
      [startX, startY, startZ],
      [endX, endY, endZ],
    ];
  });
}

function moveBricks(bricks: Array<Brick>): Array<Brick> {
  // Sort the bricks by their z-value, so we check them in order
  bricks.sort((a, b) => a[0][2] - b[0][2]);

  // Let's iterate over the bricks and see if we can move them down
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];

    let maxZ = 1;
    // Go through all the bricks bellow the current one to see if we can move it down
    for (let j = 0; j < i; j++) {
      const brickBellow = bricks[j];

      if (isBricksOverlap(brick, brickBellow)) {
        const [brickBellowStart, brickBellowEnd] = brickBellow;
        const [brickBellowXStart, brickBellowYStart, brickBellowZStart] =
          brickBellowStart;
        const [brickBellowXEnd, brickBellowYEnd, brickBellowZEnd] =
          brickBellowEnd;

        // Check what is the max z-value that we can move the brick to
        // It's the z-value of the brick bellow + 1 (so we don't overlap and be right on top of it)
        maxZ = Math.max(maxZ, brickBellowZEnd + 1);
      }

      // Move the brick down
      const [brickStart, brickEnd] = brick;
      const [brickXStart, brickYStart, brickZStart] = brickStart;
      const [brickXEnd, brickYEnd, brickZEnd] = brickEnd;

      brick[1][2] -= brickZStart - maxZ;
      brick[0][2] = maxZ;
    }
  }

  // Sort the bricks by their z-value, so we check them in order
  bricks.sort((a, b) => a[0][2] - b[0][2]);

  return bricks;
}

function isBricksOverlap(a: Brick, b: Brick): boolean {
  const [aStart, aEnd] = a;
  const [bStart, bEnd] = b;

  const [aXStart, aYStart] = aStart;
  const [aXEnd, aYEnd] = aEnd;

  const [bXStart, bYStart] = bStart;
  const [bXEnd, bYEnd] = bEnd;

  const isXOverlap = Math.max(aXStart, bXStart) <= Math.min(aXEnd, bXEnd);
  const isYOverlap = Math.max(aYStart, bYStart) <= Math.min(aYEnd, bYEnd);

  return isXOverlap && isYOverlap;
}

function fundBricksSupports(bricks: Array<Brick>): {
  bricksSupports: Record<number, number[]>;
  bricksSupportedBy: Record<number, number[]>;
} {
  const bricksSupports: Record<number, number[]> = {};
  const bricksSupportedBy: Record<number, number[]> = {};

  bricks.forEach((brick, i) => {
    bricksSupports[i] = [];
    bricksSupportedBy[i] = [];
  });

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    const [brickStart, brickEnd] = brick;
    const [brickXStart, brickYStart, brickZStart] = brickStart;
    const [brickXEnd, brickYEnd, brickZEnd] = brickEnd;

    for (let j = 0; j < i; j++) {
      const brickBellow = bricks[j];
      const [brickBellowStart, brickBellowEnd] = brickBellow;
      const [brickBellowXStart, brickBellowYStart, brickBellowZStart] =
        brickBellowStart;
      const [brickBellowXEnd, brickBellowYEnd, brickBellowZEnd] =
        brickBellowEnd;

      // Check if the brick is directly on top of the brick bellow
      if (
        isBricksOverlap(brick, brickBellow) &&
        brickZStart === brickBellowZEnd + 1
      ) {
        bricksSupports[j].push(i);
        bricksSupportedBy[i].push(j);
      }
    }
  }

  return {
    bricksSupports,
    bricksSupportedBy,
  };
}

const findDisintegratingBricksCount = (
  bricks: Array<Brick>,
  bricksSupports: Record<number, number[]>,
  bricksSupportedBy: Record<number, number[]>,
): number => {
  let disintegratingBricksCount = 0;

  // Go through all the bricks and check if they are falling
  for (let brickIndex = 0; brickIndex < bricks.length; brickIndex++) {
    // If the brick is not supported by any other brick, then it will fall
    const queue = [];

    // Add all the bricks that are supported by the current brick to the queue
    for (const brickSupportsIndex of bricksSupports[brickIndex]) {
      if (bricksSupportedBy[brickSupportsIndex].length === 1) {
        queue.push(brickSupportsIndex);
      }
    }

    // Let's keep track of the bricks that are falling
    const fallingBricks = new Set(queue);

    // Add the current brick to the falling set
    fallingBricks.add(brickIndex);

    // Go through all the bricks that are falling and check if they are supported by other bricks
    while (queue.length > 0) {
      const fallingBrickIndex = queue.shift() as number;
      const remainingBricksSupports = new Set(
        bricksSupports[fallingBrickIndex],
      );

      for (const remainingBrickSupportsIndex of remainingBricksSupports) {
        // If the brick is not already falling and all the bricks that support it are falling
        if (
          !fallingBricks.has(remainingBrickSupportsIndex) &&
          bricksSupportedBy[remainingBrickSupportsIndex].every((brick) =>
            fallingBricks.has(brick),
          )
        ) {
          // Then the brick will fall too, so add it to the queue and to the falling set
          queue.push(remainingBrickSupportsIndex);
          fallingBricks.add(remainingBrickSupportsIndex);
        }
      }
    }

    // Let's count how many bricks are falling so far
    disintegratingBricksCount += fallingBricks.size - 1;
  }

  return disintegratingBricksCount;
};

function printBricks(bricks: Array<Brick>): void {
  console.log(bricks.map((brick) => brick.join("~")).join("\n"));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const bricks = readInput(inputLines);
const movedBricks = moveBricks(bricks);
const { bricksSupports, bricksSupportedBy } = fundBricksSupports(movedBricks);
const bricksSupportedByCount = findDisintegratingBricksCount(
  movedBricks,
  bricksSupports,
  bricksSupportedBy,
);

console.log(bricksSupportedByCount);
