import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";

const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function splitRucksackContentByDepartments(rucksacks: string[]): string[][] {
  const rucksackContents: string[][] = rucksacks.map((rucksack) => {
    const rucksackDepartmentSize = rucksack.length / 2;
    const rucksackDepartment1Content = rucksack.slice(
      0,
      rucksackDepartmentSize
    );
    const rucksackDepartment2Content = rucksack.slice(rucksackDepartmentSize);

    return [rucksackDepartment1Content, rucksackDepartment2Content];
  });

  return rucksackContents;
}

function findRucksackCommonItemTypes(rucksackContents: string[][]): string[] {
  const rucksackCommonItemTypes: string[] = rucksackContents.map(
    ([rucksackDepartment1Content, rucksackDepartment2Content]) => {
      let rucksackCommonItemType = "";

      rucksackDepartment1Content.split("").forEach((itemType) => {
        if (rucksackDepartment2Content.includes(itemType)) {
          rucksackCommonItemType = itemType;
        }
      });

      return rucksackCommonItemType;
    }
  );

  return rucksackCommonItemTypes;
}

function calculateRucksackCommonItemTypeScores(itemTypes: string[]): number[] {
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

function calculateRucksackScore(scores: number[]): number {
  return scores.reduce((sum, score) => sum + score, 0);
}

const rucksacks = inputLines;
const rucksackContents = splitRucksackContentByDepartments(rucksacks);
const rucksackCommonItemTypes = findRucksackCommonItemTypes(rucksackContents);
const rucksackCommonItemTypeScores = calculateRucksackCommonItemTypeScores(
  rucksackCommonItemTypes
);
const rucksackCommonItemTypeScoresSum = calculateRucksackScore(
  rucksackCommonItemTypeScores
);

console.log("Score: %s", rucksackCommonItemTypeScoresSum);
