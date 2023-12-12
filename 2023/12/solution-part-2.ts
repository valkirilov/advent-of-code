import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

const SCALE_FACTOR = 5;

enum SpringStatus {
  Operational = ".",
  Damaged = "#",
  Unknown = "?",
}

interface Report {
  cipher: string;
  checksum: number[];
}

function readInput(input: string[]): Report[] {
  return input.map(parseReport);
}

function parseReport(line: string): Report {
  const [cipher, checksum] = line.split(" ");

  // Apply scale factor (I know that it won't work for the real input)
  // Multiple the current cipher by the scale factor and add ? in between
  // And only multiply the checksum by the scale factor
  let scaledCipher = String(cipher);
  let scaledChecksum = String(checksum);

  for (let i = 1; i < SCALE_FACTOR; i++) {
    scaledCipher += "?" + cipher;
    scaledChecksum += "," + checksum;
  }

  return {
    cipher: scaledCipher,
    checksum: parseChecksum(scaledChecksum),
  };
}

function parseChecksum(checksum: string): number[] {
  return checksum.split(",").map((char) => parseInt(char));
}

function countReports(reports: Report[]): number {
  return reports.reduce((sum: number | any, report: Report, index: number) => {
    const { cipher, checksum } = report;

    const startTimestamp = Date.now();
    const count = countReport(cipher, checksum);
    const endTimestamp = Date.now();

    // console.log("%s: %s -> %s", index, cipher, count);
    // console.log("Cache: %s", cache);
    // console.log(
    //   "Time:",
    //   convertMillisecondsToTimeElapsed(endTimestamp - startTimestamp),
    // );
    // console.log("Cache hits: %s", cacheHits);

    return (sum += count);
  }, 0);
}

const cache: { [key: string]: number } = {};
const cacheHits: { [key: string]: number } = {};

function countReport(
  cipher: string,
  checksum: number[],
  isCountingBlock: boolean = false,
): number {
  const cacheKey = generateCacheKey(cipher, checksum, isCountingBlock);

  if (cacheKey in cache) {
    cacheHits[cacheKey] = (cacheHits[cacheKey] || 0) + 1;
    return cache[cacheKey];
  }

  // If we reached the end of the cipher, we're done
  if (cipher.length === 0) {
    // So, based on the current checksum, we can determine if the block is valid

    // If there are no more regions in the checksum, we're done
    // cipher: "" checksum: [0]
    if (sumChecksum(checksum) === 0) {
      return saveCache(cacheKey, 1);
    }

    // Otherwise, we're still in an unterminated region, i.e. the cipher is invalid
    // cipher: "" checksum: [1]
    return saveCache(cacheKey, 0);
  }

  // If we don't have other regions to fill (i.e. the checksum is empty)
  // cipher: ".#?#." checksum: [0, 0]
  if (sumChecksum(checksum) === 0) {
    // If we still have damaged springs in the cipher, it means it's invalid
    // cipher: ".#..." checksum: [0, 0]
    if (cipher.includes(SpringStatus.Damaged)) {
      return saveCache(cacheKey, 0);
    }

    // Otherwise, we have only unknowns and we can replace them with operational springs, i.e. the cipher is valid
    // cipher: ".??.." checksum: [0, 0]
    return saveCache(cacheKey, 1);
  }

  // In the rest of the cases, the cipher is not empty and we ned to process it
  // cipher: ".#?#." checksum: [1, 2]

  // If we reached a damaged spring, we should determine the region it belongs to (based on the checksum)
  // cipher: "#?#." checksum: [1, 2]
  if (cipher[0] === SpringStatus.Damaged) {
    // If we should finish the current region (based on the checksum), then the cipher is invalid
    // cipher: "#?#." checksum: [0, 2]
    if (isCountingBlock && checksum[0] === 0) {
      return saveCache(cacheKey, 0);
    }

    // Otherwise, pass on to the next symbol in the cipher
    const nextCipher = cipher.slice(1);
    const nextChecksum = [checksum[0] - 1, ...checksum.slice(1)];

    return saveCache(cacheKey, countReport(nextCipher, nextChecksum, true));
  }

  // If we reached an operational spring
  // cipher: ".#?#." checksum: [1, 2]

  if (cipher[0] === SpringStatus.Operational) {
    // And we're still in the middle of a region, it means it cannot terminate properly, i.e. the cipher is invalid
    // cipher: "...?" checksum: [1, 2]
    if (isCountingBlock && checksum[0] > 0) {
      return saveCache(cacheKey, 0);
    }

    // Or if we reached the end of a region, we should terminate it and pass on to the next symbol in the cipher
    // cipher: ".#..." checksum: [0, 2]
    if (checksum[0] === 0) {
      const nextCipher = cipher.slice(1);
      const nextChecksum = checksum.slice(1);

      return saveCache(cacheKey, countReport(nextCipher, nextChecksum, false));
    }

    // Otherwise continue, pass on to the next symbol in the cipher
    // cipher: ".#..." checksum: [1, 2]
    const nextCipher = cipher.slice(1);
    const nextChecksum = checksum.slice(0);

    return saveCache(cacheKey, countReport(nextCipher, nextChecksum, false));
  }

  // If we reached an unknown spring, we have a varies  ty of options

  // If we're still in the middle of a region
  if (isCountingBlock) {
    // And if we don't have any more regions according to the checksum, we're done with this block (i.e. marking it as operational)
    // cipher: ".#?#." checksum: [0, 2]
    if (checksum[0] === 0) {
      const nextCipher = cipher.slice(1);
      const nextChecksum = checksum.slice(1);

      return saveCache(cacheKey, countReport(nextCipher, nextChecksum, false));
    }

    // Otherwise, we're still in a region and we should place it as broken spring
    // cipher: "?..." checksum: [1, 2]
    const nextCipher = cipher.slice(1);
    const nextChecksum = [checksum[0] - 1, ...checksum.slice(1)];

    return saveCache(cacheKey, countReport(nextCipher, nextChecksum, true));
  }

  // Otherwise we're no longer in a block and we should try both options (operational and damaged)

  const nextCipherWithoutNewRegion = cipher.slice(1);
  const nextChecksumWithoutNewRegion = checksum.slice(0);
  const countWithoutNewRegion = countReport(
    nextCipherWithoutNewRegion,
    nextChecksumWithoutNewRegion,
    false,
  );

  const nextCipherWithNewRegion = cipher.slice(1);
  const nextChecksumWithNewRegion = [checksum[0] - 1, ...checksum.slice(1)];
  const countWithNewRegion = countReport(
    nextCipherWithNewRegion,
    nextChecksumWithNewRegion,
    true,
  );

  return saveCache(cacheKey, countWithoutNewRegion + countWithNewRegion);
}

function generateCacheKey(
  cipher: string,
  checksum: number[],
  isCountingBlock: boolean,
): string {
  const key = `${cipher}:${checksum.join(",")}:${isCountingBlock}`;

  return key;
}

function saveCache(key: string, value: number): number {
  cache[key] = value;

  return value;
}

function convertMillisecondsToTimeElapsed(time: number): string {
  const date = new Date(time);

  return `${date.getMinutes()}:${date.getSeconds()}m ${date.getMilliseconds()}ms`;
}

function sumChecksum(checksum: number[]): number {
  return checksum.reduce((sum, value) => sum + value, 0);
}

function printReports(reports: Report[]): void {
  reports.forEach(printReport);
}

function printReport(report: Report): void {
  console.log();
  console.log("Report:");
  console.log(report.cipher);
  console.log(report.checksum.join(","));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const reports = readInput(inputLines);
const count = countReports(reports);

console.log(count);
