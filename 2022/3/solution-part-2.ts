import * as fs from "fs";
import { get } from "http";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";

const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function splitRucksacksByElvesGroups(rucksacks: string[]): string[][] {
  const groupSize = 3;
  let currentGroupSize = 0;

  const rucksackElvesGroups: string[][] = rucksacks.reduce(
    (rucksackElvesGroups: string[][], rucksack) => {
      if (currentGroupSize === 0) {
        rucksackElvesGroups.push([]);
      }

      rucksackElvesGroups[rucksackElvesGroups.length - 1].push(rucksack);

      currentGroupSize++;

      if (currentGroupSize === groupSize) {
        currentGroupSize = 0;
      }

      return rucksackElvesGroups;
    },
    []
  );

  return rucksackElvesGroups;
}

function findElvesGroupsBadges(rucksackContents: string[][]): string[] {
  const rucksackCommonItemTypes: string[] = rucksackContents.map(
    ([
      rucksackDepartment1Content,
      rucksackDepartment2Content,
      rucksackDepartment3Content,
    ]) => {
      let rucksackCommonItemType = "";

      rucksackDepartment1Content.split("").forEach((itemType) => {
        if (
          rucksackDepartment2Content.includes(itemType) &&
          rucksackDepartment3Content.includes(itemType)
        ) {
          rucksackCommonItemType = itemType;
        }
      });

      return rucksackCommonItemType;
    }
  );

  return rucksackCommonItemTypes;
}

function calculateElvesGroupsBadgesScores(itemTypes: string[]): number[] {
  return itemTypes.map(mapRucksackItemTypeScore);
}

function mapRucksackItemTypeScore(itemType: string): number {
  const itemTypeCharCode = itemType.charCodeAt(0);

  if (itemTypeCharCode >= 97 && itemTypeCharCode <= 122) {
    return itemTypeCharCode - 96;
  } else if (itemTypeCharCode >= 65 && itemTypeCharCode <= 90) {
    return itemTypeCharCode - 64 + 26;
  }

  throw new Error("Invalid item type");
}

function calculateElvesBadgesScore(scores: number[]): number {
  return scores.reduce((sum, score) => sum + score, 0);
}

const rucksacks = inputLines;
const rucksackElvesGroups = splitRucksacksByElvesGroups(rucksacks);
const rucksackElvesGroupsBadges = findElvesGroupsBadges(rucksackElvesGroups);
const elvesGroupsBadgesScores = calculateElvesGroupsBadgesScores(
  rucksackElvesGroupsBadges
);
const elvesGroupsBadgesScoresSum = calculateElvesBadgesScore(
  elvesGroupsBadgesScores
);

console.log("Score: %s", elvesGroupsBadgesScoresSum);
