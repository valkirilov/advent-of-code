import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): string {
  return input.join();
}

interface GraphData {
  [key: string]: string[];
}

function formatGraphData(input: string[]): GraphData {
  const graphData: GraphData = {};

  for (const line of input) {
    const [node, connections] = line.split(":");
    const edge = node.trim();
    const connectionList = connections.trim().split(" ");

    graphData[edge] = connectionList;
  }

  return graphData;
}

function generateEdgesAndConnections(graphData: GraphData): void {
  const edges = Object.keys(graphData);
  const connections: string[] = [];

  edges.forEach((edge) => {
    graphData[edge].forEach((connection) => {
      connections.push(`${edge} ${connection}`);
    });
  });

  console.log("Edges:");
  console.log(edges.join("\n"));

  console.log("\nConnections:");
  console.log(connections.join("\n"));
}

const graphData = formatGraphData(inputLines);
generateEdgesAndConnections(graphData);
