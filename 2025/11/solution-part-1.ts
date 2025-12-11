import { count } from "console";
import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const START = "you";
const END = "out";

function readInput(input: string[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  input.forEach((line) => {
    const [node, edges] = line.split(":");
    if (!graph.has(node)) {
      graph.set(node, []);
    }

    edges
      .trim()
      .split(" ")
      .forEach((edge) => {
        graph.get(node)?.push(edge);
      });
  });

  return graph;
}

function countPaths(graph: Map<string, string[]>): number {
  let pathCount = 0;

  const queue: { currentNode: string; visited: Set<string> }[] = [
    { currentNode: START, visited: new Set([START]) },
  ];

  while (queue.length > 0) {
    const { currentNode, visited } = queue.pop()!;

    if (currentNode === END) {
      pathCount++;
      continue;
    }

    const neighbors = graph.get(currentNode) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const newVisited = new Set(visited);
        newVisited.add(neighbor);
        queue.push({ currentNode: neighbor, visited: newVisited });
      }
    }
  }

  return pathCount;
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const paths = countPaths(parsedInput);
console.log(paths);
