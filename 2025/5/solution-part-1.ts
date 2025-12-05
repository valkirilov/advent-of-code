import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): {
  ranges: [number, number][];
  ingredients: number[];
} {
  const ranges: [number, number][] = [];
  const ingredients: number[] = [];

  let isReadingRanges = true;

  for (const line of input) {
    const trimmedLine = line.trim();

    if (trimmedLine === "") {
      isReadingRanges = false;
      continue;
    }

    if (isReadingRanges) {
      const [minStr, maxStr] = trimmedLine.split("-");
      const min = Number(minStr);
      const max = Number(maxStr);

      ranges.push([min, max]);
    } else {
      const ingredient = Number(trimmedLine);

      ingredients.push(ingredient);
    }
  }

  return {
    ranges,
    ingredients,
  };
}

interface Range {
  min: number;
  max: number;
}

function buildRanges(input: [number, number][]): Range[] {
  const ranges: Range[] = [];

  input
    .sort(([minA], [minB]) => minA - minB)
    .forEach(([min, max]) => {
      if (ranges.length === 0) {
        ranges.push({ min, max });
        return;
      }

      for (let range of ranges) {
        if (
          (min >= range.min && min <= range.max) ||
          (max >= range.min && max <= range.max)
        ) {
          range.min = Math.min(range.min, min);
          range.max = Math.max(range.max, max);
          return;
        }
      }

      ranges.push({ min, max });
    });

  return ranges;
}

function countFreshIngredients(ranges: Range[], ingredients: number[]): number {
  return ingredients.reduce((count, ingredient) => {
    const isFresh = ranges.some(
      (range) => ingredient >= range.min && ingredient <= range.max,
    );

    return isFresh ? count + 1 : count;
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { ranges: inputRanges, ingredients } = readInput(inputLines);
const ranges = buildRanges(inputRanges);
const freshCount = countFreshIngredients(ranges, ingredients);
console.log(freshCount);
