import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Rule {
  left: number;
  right: number;
}

function readInput(input: string[]): {
  rules: Rule[];
  requests: number[][];
} {
  const rules: Rule[] = [];
  const requests: number[][] = [];

  let isReadingRules = true;
  input.forEach((line, index) => {
    if (line === "") {
      isReadingRules = false;
      return;
    }

    if (isReadingRules) {
      const [left, right] = line.split("|").map(Number);

      rules.push({ left, right });
    } else {
      const numbers = line.split(",").map(Number);

      requests.push(numbers);
    }
  });

  return { rules, requests };
}

function buildRulesMap(rules: Rule[]): Map<number, number[]> {
  const rulesMap = new Map<number, number[]>();

  rules.forEach((rule) => {
    const { left, right } = rule;

    // Add left rule to the map if it doesn't exist
    if (!rulesMap.has(left)) {
      rulesMap.set(left, []);
    }

    // Add the right value as a possible value for the left rule
    rulesMap.get(left)?.push(right);
  });

  return rulesMap;
}

function findValidRequests(
  requests: number[][],
  rulesMap: Map<number, number[]>,
): number[][] {
  return requests.filter((request) => isValidRequest(request, rulesMap));
}

function isValidRequest(
  request: number[],
  rulesMap: Map<number, number[]>,
): boolean {
  let isValid = true;

  for (let i = 0; i < request.length - 1; i++) {
    const number = request[i];
    const nextNumber = request[i + 1];

    // Check if the next number is a possible value for the current number
    if (!rulesMap.get(number)?.includes(nextNumber)) {
      isValid = false;
      break;
    }
  }

  return isValid;
}

function findMiddleNumbers(validRequests: number[][]): number[] {
  return validRequests.map(findMiddleNumber);
}

function findMiddleNumber(request: number[]): number {
  const maxIndex = request.length - 1;
  const middleIndex = Math.floor(maxIndex / 2);

  return request[middleIndex];
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const { rules, requests } = readInput(inputLines);
const rulesMap = buildRulesMap(rules);
const validRequests = findValidRequests(requests, rulesMap);
const middlesNumbers = findMiddleNumbers(validRequests);
const result = middlesNumbers.reduce((acc, number) => acc + number, 0);
console.log(result);
