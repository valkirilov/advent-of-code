import * as fs from "fs";
import * as path from "path";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const START = "svr";
const PASSES_THROUGH = ["fft", "dac"];
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
      // pathCount++;

      if (PASSES_THROUGH.every((node) => visited.has(node))) {
        console.log("Valid path: %s", pathCount);
        pathCount++;
      }

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

function countPathsMemo(graph: Map<string, string[]>): number {
  const memo = new Map<string, number>();

  function getMemoKey(node: string, requiredVisited: Set<string>): string {
    const required = Array.from(requiredVisited).sort().join(",");
    return `${node}|${required}`;
  }

  const queue: {
    currentNode: string;
    visited: Set<string>;
    requiredVisited: Set<string>;
  }[] = [
    {
      currentNode: START,
      visited: new Set([START]),
      requiredVisited: new Set(),
    },
  ];

  let pathCount = 0;

  while (queue.length > 0) {
    const { currentNode, visited, requiredVisited } = queue.pop()!;

    if (currentNode === END) {
      if (PASSES_THROUGH.every((node) => requiredVisited.has(node))) {
        if (pathCount % 10000 === 0) {
          console.log("Valid path: %s", pathCount);
        }

        pathCount++;
      }
      continue;
    }

    const neighbors = graph.get(currentNode) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const newVisited = new Set(visited);
        newVisited.add(neighbor);

        const newRequiredVisited = new Set(requiredVisited);
        if (PASSES_THROUGH.includes(neighbor)) {
          newRequiredVisited.add(neighbor);
        }

        queue.push({
          currentNode: neighbor,
          visited: newVisited,
          requiredVisited: newRequiredVisited,
        });
      }
    }
  }

  return pathCount;
}

function countPathsRecursive(graph: Map<string, string[]>): number {
  const memo = new Map<string, number>();

  // Track which required nodes we've visited as a sorted string
  function getMemoKey(node: string, requiredVisited: Set<string>): string {
    const required = Array.from(requiredVisited).sort().join(",");
    return `${node}|${required}`;
  }

  function dfs(
    currentNode: string,
    visited: Set<string>,
    requiredVisited: Set<string>,
  ): number {
    // Base case: reached the end
    if (currentNode === END) {
      // Check if we visited all required nodes
      return PASSES_THROUGH.every((node) => requiredVisited.has(node)) ? 1 : 0;
    }

    // Check memo - we can reuse paths from this state
    const memoKey = getMemoKey(currentNode, requiredVisited);
    if (memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }

    let count = 0;
    const neighbors = graph.get(currentNode) || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const newVisited = new Set(visited);
        newVisited.add(neighbor);

        // Update required visited set if this neighbor is a required node
        const newRequiredVisited = new Set(requiredVisited);
        if (PASSES_THROUGH.includes(neighbor)) {
          newRequiredVisited.add(neighbor);
        }

        count += dfs(neighbor, newVisited, newRequiredVisited);
      }
    }

    memo.set(memoKey, count);
    return count;
  }

  return dfs(START, new Set([START]), new Set());
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
// const paths = countPathsMemo(parsedInput);
const paths = countPathsRecursive(parsedInput);
console.log(paths);
