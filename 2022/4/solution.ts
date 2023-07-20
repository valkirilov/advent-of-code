import * as fs from "fs";
import { parse } from "path";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";

const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function parseInput(inputLines: string[]): string[][] {
  const elvesGroups = inputLines.map((line) => line.split(","));

  return elvesGroups;
}

function findElvesGroupsFullyContains(elvesGroups: string[][]) {
  const similarGroups: string[][] = [];

  elvesGroups.forEach((elvesGroup) => {
    const [elf1StartRegion, elf1EndRegion] = elvesGroup[0].split("-");
    const [elf2StartRegion, elf2EndRegion] = elvesGroup[1].split("-");

    if (
      parseInt(elf1StartRegion) >= parseInt(elf2StartRegion) &&
      parseInt(elf1EndRegion) <= parseInt(elf2EndRegion)
    ) {
      similarGroups.push(elvesGroup);
    } else if (
      parseInt(elf2StartRegion) >= parseInt(elf1StartRegion) &&
      parseInt(elf2EndRegion) <= parseInt(elf1EndRegion)
    ) {
      similarGroups.push(elvesGroup);
    }
  });

  return similarGroups;
}

function findElvesGroupsPartialOverlaps(elvesGroups: string[][]) {
  const similarGroups: string[][] = [];

  elvesGroups.forEach((elvesGroup) => {
    const [elf1StartRegion, elf1EndRegion] = elvesGroup[0].split("-");
    const [elf2StartRegion, elf2EndRegion] = elvesGroup[1].split("-");

    if (
      isPointBetweenConstraints(elf1StartRegion, elf2StartRegion, elf2EndRegion)
    ) {
      similarGroups.push(elvesGroup);
    } else if (
      isPointBetweenConstraints(elf1EndRegion, elf2StartRegion, elf2EndRegion)
    ) {
      similarGroups.push(elvesGroup);
    } else if (
      isPointBetweenConstraints(elf2StartRegion, elf1StartRegion, elf1EndRegion)
    ) {
      similarGroups.push(elvesGroup);
    } else if (
      isPointBetweenConstraints(elf2EndRegion, elf1StartRegion, elf1EndRegion)
    ) {
      similarGroups.push(elvesGroup);
    }
  });

  return similarGroups;
}

function isPointBetweenConstraints(
  point: string,
  min: string,
  max: string
): boolean {
  return parseInt(point) >= parseInt(min) && parseInt(point) <= parseInt(max);
}

const elvesSections = parseInput(inputLines);
const fullyContainedGroups = findElvesGroupsFullyContains(elvesSections);

console.log("Result - Part 1: %s", fullyContainedGroups.length);

// Part 2
const partialOverlapsGroups = findElvesGroupsPartialOverlaps(elvesSections);

console.log("Result - Part 2: %s", partialOverlapsGroups.length);
