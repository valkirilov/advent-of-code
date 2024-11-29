import * as graphlib from "@dagrejs/graphlib";
import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
// const inputLines = input.split("\n");

const g = new graphlib.Graph();

// Replace this with your actual input data
const inputLines = [
  "jqt: rhn xhk nvd",
  "rsh: frs pzl lsr",
  "xhk: hfx",
  "cmg: qnr nvd lhk bvb",
  "rhn: xhk bvb hfx",
  "bvb: xhk hfx",
  "pzl: lsr hfx nvd",
  "qnr: nvd",
  "ntq: jqt hfx bvb xhk",
  "nvd: lhk",
  "lsr: lhk",
  "rzs: qnr cmg lsr rsh",
  "frs: qnr lhk lsr",
];
for (const line of inputLines) {
  const [left, right] = line.split(":");
  const leftNode = left.trim();
  const rightNodes = right.trim().split(/\s+/);

  // Add the left node if it doesn't exist yet
  if (!g.hasNode(leftNode)) {
    g.setNode(leftNode);
  }

  // Add edges between left node and each right node
  for (const rightNode of rightNodes) {
    if (!g.hasNode(rightNode)) {
      g.setNode(rightNode);
    }
    // Add a directed edge from left to right
    g.setEdge(leftNode, rightNode);
  }
}

// Find the maximum flow in the graph
const flowGraph = graphlib.json.write(g);
const maxFlow = graphlib.alg.maxFlow(flowGraph, "source", "sink");

// Extract the minimum edge cut from the residual graph
const residualGraph = graphlib.json.read(maxFlow.residual);
const minEdgeCut = graphlib.alg.flow.minimumEdgeCut(residualGraph);

// Remove the minimum edge cut from the original graph
minEdgeCut.forEach((edge) => g.removeEdge(edge));

const components = graphlib.alg.components(g);

const componentSizes = components.map((component) => component.length);
const result = componentSizes.reduce((product, size) => product * size, 1);

console.log(result);
