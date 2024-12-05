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

function findInvalidRequests(
  requests: number[][],
  rulesMap: Map<number, number[]>,
): number[][] {
  return requests.filter((request) => !isValidRequest(request, rulesMap));
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

function reorderRequests(
  invalidRequests: number[][],
  rules: Rule[],
  rulesMap: Map<number, number[]>,
): number[][] {
  return invalidRequests.map((request) => reorderRequestQuick(request, rules));
  return invalidRequests.map((request) => reorderRequest(request, rulesMap));
}

function reorderRequest(
  request: number[],
  rulesMap: Map<number, number[]>,
): number[] {
  // Generate all possible permutations of the request and find the valid one
  const permutations = permuteRequest(request);

  const validRequest = permutations.find((request) =>
    isValidRequest(request, rulesMap),
  );

  return validRequest!;
}

function permuteRequest(request: number[]): number[][] {
  const permutations: number[][] = [];

  function permute(
    request: number[],
    startIndex: number,
    endIndex: number,
  ): void {
    if (startIndex === endIndex) {
      permutations.push([...request]);
    } else {
      for (let i = startIndex; i <= endIndex; i++) {
        [request[startIndex], request[i]] = [request[i], request[startIndex]];
        permute(request, startIndex + 1, endIndex);
        [request[startIndex], request[i]] = [request[i], request[startIndex]];
      }
    }
  }

  permute(request, 0, request.length - 1);

  return permutations;
}

function reorderRequestQuick(request: number[], rules: Rule[]): number[] {
  request.sort((a, b) => {
    const rule = rules.find((rule) => rule.left === a && rule.right === b);

    if (rule) {
      return -1;
    }

    return 1;
  });

  return request;
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
const invalidRequests = findInvalidRequests(requests, rulesMap);
const reorderedRequests = reorderRequests(invalidRequests, rules, rulesMap);
const middlesNumbers = findMiddleNumbers(reorderedRequests);
const result = middlesNumbers.reduce((acc, number) => acc + number, 0);
console.log(result);
