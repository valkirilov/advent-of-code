import { count } from "console";
import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Robot {
  position: [number, number];
  velocity: [number, number];
}

function readInput(input: string[]): Robot[] {
  return input.map(readRobot);
}

function readRobot(line: string): Robot {
  const [position, velocity] = line.split(" ");
  const [px, py] = position.replace("p=", "").split(",").map(Number);
  const [vx, vy] = velocity.replace("v=", "").split(",").map(Number);

  return {
    position: [px, py],
    velocity: [vx, vy],
  };
}

function moveRobots(
  robots: Robot[],
  space: [number, number],
  moves: number,
): Robot[] {
  for (let i = 0; i < moves; i++) {
    robots = robots.map((robot) => {
      const [px, py] = robot.position;
      const [vx, vy] = robot.velocity;

      const newX = px + vx;
      const newY = py + vy;

      // Make sure the robot is within the space, so if it goes out of bounds we move it on the opposite side
      const [spaceX, spaceY] = space;
      const x = Math.abs((newX + spaceX) % spaceX);
      const y = Math.abs((newY + spaceY) % spaceY);

      return {
        position: [x, y],
        velocity: [vx, vy],
      };
    });
  }

  return robots;
}

function countQuadrants(robots: Robot[], space: [number, number]): number[] {
  const [spaceX, spaceY] = space;

  // 101, 103

  // 101/2 = 50 | 51 | 52
  // 103/2 = 51 | 52 | 53

  // 101-52 = 49
  // 103-53 = 50

  const middleX = Math.floor(spaceX / 2);
  const middleY = Math.floor(spaceY / 2);

  // Split the space into 4 quadrants, and skip the middle lines
  const q1X1 = 0;
  const q1Y1 = 0;
  const q1X2 = middleX - 1;
  const q1Y2 = middleY - 1;

  const q2X1 = middleX + 1;
  const q2Y1 = 0;
  const q2X2 = spaceX;
  const q2Y2 = middleY - 1;

  const q3X1 = 0;
  const q3Y1 = middleY + 1;
  const q3X2 = middleX - 1;
  const q3Y2 = spaceY;

  const q4X1 = middleX + 1;
  const q4Y1 = middleY + 1;
  const q4X2 = spaceX;
  const q4Y2 = spaceY;

  // console.log(q1X1, q1Y1, q1X2, q1Y2);
  // console.log(q2X1, q2Y1, q2X2, q2Y2);
  // console.log(q3X1, q3Y1, q3X2, q3Y2);
  // console.log(q4X1, q4Y1, q4X2, q4Y2);

  const quadrants = [0, 0, 0, 0];

  robots.forEach((robot) => {
    const [x, y] = robot.position;

    if (x >= q1X1 && x <= q1X2 && y >= q1Y1 && y <= q1Y2) {
      quadrants[0]++;
    } else if (x >= q2X1 && x <= q2X2 && y >= q2Y1 && y <= q2Y2) {
      quadrants[1]++;
    } else if (x >= q3X1 && x <= q3X2 && y >= q3Y1 && y <= q3Y2) {
      quadrants[2]++;
    } else if (x >= q4X1 && x <= q4X2 && y >= q4Y1 && y <= q4Y2) {
      quadrants[3]++;
    }
  });

  return quadrants;
}

function printMap(robots: Robot[], space: [number, number]) {
  const [spaceX, spaceY] = space;

  // Create a map with the space dimensions filled with 0s
  const map = Array.from({ length: spaceY }, () =>
    Array.from({ length: spaceX }, () => 0),
  );

  robots.forEach((robot) => {
    const [x, y] = robot.position;

    map[y][x]++;
  });

  console.log(map.join("\n"));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const robots = readInput(inputLines);
const space: [number, number] = [101, 103];
// const space: [number, number] = [11, 7];
const moves = 100;
const finalRobots = moveRobots(robots, space, moves);
const quadrants = countQuadrants(finalRobots, space);
const safetyScore = quadrants.reduce((acc, count) => acc * count, 1);
// printMap(finalRobots, space);
// console.log(quadrants);
console.log(safetyScore);

// 68311656 too low
// 230869170 too high
// 239850072
// 217132650
