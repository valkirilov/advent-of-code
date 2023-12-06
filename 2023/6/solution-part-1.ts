import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Race {
  time: number;
  distance: number;
  races: Array<{
    hold: number;
    speed: number;
    distance: number;
  }>
}

function readInput(input: string[]): Race[] {
  const times: number[] = parseTimes(input[0]);
  const distances: number[] = parseDistances(input[1]);
  
  return times.map((time, index) => ({
    time,
    distance: distances[index],
    races: [],
  }));
}

function parseTimes(line: string): number[] {
  const [_, times] = line.split("Time: ");
  
  return times.split(" ").filter(Boolean).map((time) => parseInt(time));
}

function parseDistances(line: string): number[] {
  const [_, distances] = line.split("Distance: ");
  
  return distances.split(" ").filter(Boolean).map((distance) => parseInt(distance));
}

function evaluateRaces(races: Race[]): Race[] {
  return races.map(evaluateRace)
}

function evaluateRace(race: Race): Race {
  for (let i = 0; i < race.time; i++) {
    const currentHold = i;
    const currentSpeed = i;
    const currentDistance = (race.time - currentHold) * currentSpeed;

    if (currentDistance > race.distance) {
      race.races.push({
        hold: currentHold,
        speed: currentSpeed,
        distance: currentDistance,
      });
    }
  }
  
  return race;
}

function calculateSolution(races: Race[]): number {
  return races.reduce((acc, race) => {
    return acc * race.races.length
  }, 1)
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const races = evaluateRaces(parsedInput);
const solution = calculateSolution(races)

console.log(solution);
