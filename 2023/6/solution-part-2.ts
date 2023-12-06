import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Race {
  time: number;
  distance: number;
  win: number;
}

function readInput(input: string[]): Race {
  const time: number = parseTime(input[0]);
  const distance: number = parseDistance(input[1]);
  
  return {
    time,
    distance,
    win: 0,
  };
}

function parseTime(line: string): number {
  const [_, times] = line.split("Time: ");
  
  return parseInt(times.replaceAll(" ", ""));
}

function parseDistance(line: string): number {
  const [_, distance] = line.split("Distance: ");
  
  return parseInt(distance.replaceAll(" ", ""));
}

function evaluateRace(race: Race): Race {  
  for (let i = 0; i < race.time; i++) {
    const currentHold = i;
    const currentSpeed = i;
    const currentDistance = (race.time - currentHold) * currentSpeed;

    if (currentDistance > race.distance) {
      race.win++;
    }
  }
  
  return race;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const race = evaluateRace(parsedInput);

console.log(race.win);
