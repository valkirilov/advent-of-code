import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Field {
  Empty = ".",
  Horizontal = "-",
  Vertical = "|",
  LeftMirror = "/",
  RightMirror = "\\",
}

enum Direction {
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

interface Point {
  x: number;
  y: number;
  value: Field;
}

interface Move {
  point: Point;
  direction: Direction;
}

function readInput(input: string[]): Field[][] {
  return input.map((line) => line.split("") as Field[]);
}

function findBeamLight(map: Field[][]): number {
  const visitedFields = Array.from({ length: map.length }, () =>
    Array.from({ length: map[0].length }, () => false),
  );
  const visitedMoves: Record<string, boolean> = {};

  const moves: Move[] = [
    {
      point: { x: 0, y: 0, value: map[0][0] },
      direction: Direction.Right,
    },
  ];

  while (moves.length > 0) {
    const move = moves.shift() as Move;
    const {
      point: { x, y, value },
      direction,
    } = move;

    // IF we already visited this field, skip it (we know where it leads)
    if (visitedMoves[generateKey(x, y, direction)]) {
      continue;
    }

    // Let's mark this field as visited
    visitedFields[y][x] = true;
    visitedMoves[generateKey(x, y, direction)] = true;

    // And let's check our next move

    // If the field is blank, we keep going in the same direction
    if (value === Field.Empty) {
      const nextPoint = getNextPoint(map, move.point, move.direction);

      if (nextPoint) {
        moves.push({
          point: nextPoint,
          direction: move.direction,
        });
      }

      continue;
    }

    // If the field is a mirror, we change direction
    if (value === Field.LeftMirror) {
      let nextDirection;
      let nextPoint;

      if (direction === Direction.Up) {
        // /
        // ^
        nextDirection = Direction.Right;
      } else if (direction === Direction.Right) {
        // > /
        nextDirection = Direction.Up;
      } else if (direction === Direction.Down) {
        // v
        // /
        nextDirection = Direction.Left;
      } else if (direction === Direction.Left) {
        // / <
        nextDirection = Direction.Down;
      }

      if (nextDirection) {
        nextPoint = getNextPoint(map, move.point, nextDirection);

        if (nextPoint) {
          moves.push({
            point: nextPoint,
            direction: nextDirection,
          });
        }
      }

      continue;
    } else if (value === Field.RightMirror) {
      let nextDirection;
      let nextPoint;

      if (direction === Direction.Up) {
        // \
        // ^
        nextDirection = Direction.Left;
      } else if (direction === Direction.Right) {
        // > \
        nextDirection = Direction.Down;
      } else if (direction === Direction.Down) {
        // v
        // \
        nextDirection = Direction.Right;
      } else if (direction === Direction.Left) {
        // \ <
        nextDirection = Direction.Up;
      }

      if (nextDirection) {
        nextPoint = getNextPoint(map, move.point, nextDirection);

        if (nextPoint) {
          moves.push({
            point: nextPoint,
            direction: nextDirection,
          });
        }
      }

      continue;
    }

    // And finally, we need to check if the field is a splitter

    // If the field is a splitter, we need to check both directions
    if (value === Field.Horizontal) {
      if (direction === Direction.Left || direction === Direction.Right) {
        const nextPoint = getNextPoint(map, move.point, direction);

        if (nextPoint) {
          moves.push({
            point: nextPoint,
            direction,
          });
        }
      } else {
        const nextPointLeft = getNextPoint(map, move.point, Direction.Left);
        const nextPointRight = getNextPoint(map, move.point, Direction.Right);

        if (nextPointLeft) {
          moves.push({
            point: nextPointLeft,
            direction: Direction.Left,
          });
        }

        if (nextPointRight) {
          moves.push({
            point: nextPointRight,
            direction: Direction.Right,
          });
        }
      }

      continue;
    } else if (value === Field.Vertical) {
      if (direction === Direction.Up || direction === Direction.Down) {
        const nextPoint = getNextPoint(map, move.point, direction);

        if (nextPoint) {
          moves.push({
            point: nextPoint,
            direction,
          });
        }
      } else {
        const nextPointUp = getNextPoint(map, move.point, Direction.Up);
        const nextPointDown = getNextPoint(map, move.point, Direction.Down);

        if (nextPointUp) {
          moves.push({
            point: nextPointUp,
            direction: Direction.Up,
          });
        }

        if (nextPointDown) {
          moves.push({
            point: nextPointDown,
            direction: Direction.Down,
          });
        }
      }

      continue;
    }
  }

  // And finally, let's count the energized fields
  const energizedFields = visitedFields.reduce(
    (acc, line) =>
      acc +
      line.reduce((acc, field) => {
        if (field) {
          return acc + 1;
        }

        return acc;
      }, 0),
    0,
  );

  return energizedFields;
}

function getNextPoint(
  map: Field[][],
  point: Point,
  direction: Direction,
): Point | null {
  const { x, y } = point;

  let newX = x;
  let newY = y;

  // Determine the next point based on the direction
  switch (direction) {
    case Direction.Up:
      newY--;
      break;
    case Direction.Down:
      newY++;
      break;
    case Direction.Left:
      newX--;
      break;
    case Direction.Right:
      newX++;
      break;
  }

  // If we are out of bounds, return null (it's not a valid move)
  if (newX < 0 || newX >= map[0].length || newY < 0 || newY >= map.length) {
    return null;
  }

  // Otherwise, return the new point
  return {
    x: newX,
    y: newY,
    value: map[newY][newX],
  };
}

function generateKey(x: number, y: number, direction: Direction): string {
  return `${x}-${y}-${direction}`;
}

function printMap(map: Field[][]): void {
  console.log(map.map((line) => line.join("")).join("\n"));
}

function printVisitedFields(visitedFields: boolean[][]): void {
  console.log(
    visitedFields
      .map((line) => line.map((field) => (field ? "X" : ".")).join(""))
      .join("\n"),
  );
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const beamLight = findBeamLight(parsedInput);

console.log(beamLight);
