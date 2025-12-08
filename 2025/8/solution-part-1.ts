import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n").filter((line) => line.trim() !== "");

interface Point {
  x: number;
  y: number;
  z: number;
}

interface Connection {
  i: number;
  j: number;
  distance: number;
}

function readInput(input: string[]): Point[] {
  return input.map(parseInput);
}

function parseInput(input: string): Point {
  const [x, y, z] = input.split(",").map(Number);

  return { x, y, z };
}

function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2),
  );
}

function getAllConnections(points: Point[]): Connection[] {
  const connections: Connection[] = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = calculateDistance(points[i], points[j]);
      connections.push({ i, j, distance });
    }
  }

  connections.sort((a, b) => a.distance - b.distance);

  return connections;
}

class Circuit {
  circuits: Map<number, number[]>;

  constructor(n: number) {
    this.circuits = new Map();

    for (let i = 0; i < n; i++) {
      this.circuits.set(i, [i]);
    }
  }

  find(x: number): number {
    for (const [circuitId, boxes] of this.circuits) {
      if (boxes.includes(x)) {
        return circuitId;
      }
    }
    throw new Error(`Box ${x} not found in any circuit`);
  }

  union(x: number, y: number): boolean {
    const circuitX = this.find(x);
    const circuitY = this.find(y);

    if (circuitX === circuitY) {
      return false; // Already in same circuit
    }

    // Merge circuit Y into circuit X
    const boxesX = this.circuits.get(circuitX)!;
    const boxesY = this.circuits.get(circuitY)!;

    boxesX.push(...boxesY);
    this.circuits.delete(circuitY);

    return true;
  }

  getCircuitSizes(): number[] {
    return Array.from(this.circuits.values()).map((boxes) => boxes.length);
  }
}

function solve(points: Point[], pairsToConnect: number): number {
  const connections = getAllConnections(points);
  const circuits = new Circuit(points.length);

  for (let i = 0; i < Math.min(pairsToConnect, connections.length); i++) {
    const connection = connections[i];

    circuits.union(connection.i, connection.j);
  }

  const circuitSizes = circuits.getCircuitSizes();
  circuitSizes.sort((a, b) => b - a);

  const result = circuitSizes[0] * circuitSizes[1] * circuitSizes[2];

  return result;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const pairsToConnect = parsedInput.length <= 20 ? 10 : 1000;
const result = solve(parsedInput, pairsToConnect);

console.log(result);
