import * as fs from "fs";
import { parse } from "path";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum SpringStatus {
  Operational = ".",
  Damaged = "#",
  Unknown = "?",
}

interface Report {
  cipher: SpringStatus[]; // Note: Consider using a string instead
  checksum: number[];
}

function readInput(input: string[]): Report[] {
  return input.map(parseReport);
}

function parseReport(line: string): Report {
  const [cipher, checksum] = line.split(" ");

  return {
    cipher: parseCipher(cipher),
    checksum: parseChecksum(checksum),
  };
}

function parseCipher(cipher: string): SpringStatus[] {
  return cipher.split("").map((char) => char as SpringStatus);
}

function countReports(reports: Report[]): number {
  let count = 0;

  reports.forEach((report) => {
    const { cipher, checksum } = report;
    const ciphers = generateCiphers(cipher);
    const validCiphers = ciphers.filter((cipher) => isValid(cipher, checksum));

    console.log(cipher.join(""), validCiphers.length);

    count += validCiphers.length;
  });

  return count;
}

function generateCiphers(cipher: SpringStatus[]): SpringStatus[][] {
  const ciphers: string[] = [[...cipher].join("")];

  while (ciphers.some((cipher) => cipher.includes(SpringStatus.Unknown))) {
    const activeCipher = ciphers.shift();

    if (!activeCipher) {
      break;
    }

    // If there are no unknowns, we're done with this cipher
    if (!activeCipher.includes(SpringStatus.Unknown)) {
      ciphers.push(activeCipher);
      continue;
    }

    // Otherwise, we need to generate two new ciphers
    const unknownIndex = activeCipher.indexOf(SpringStatus.Unknown);
    const newCipher = [...activeCipher];

    newCipher[unknownIndex] = SpringStatus.Operational;
    ciphers.push(newCipher.join(""));

    newCipher[unknownIndex] = SpringStatus.Damaged;
    ciphers.push(newCipher.join(""));
  }

  return ciphers.map(parseCipher);
}

function isValid(cipher: SpringStatus[], checksum: number[]): boolean {
  let isValid = true;

  const simplifiedCipher = cipher.join("").replace(/\.{2,}/g, ".");
  const cipherRegions = simplifiedCipher
    .split(".")
    .filter((region) => region.length > 0);

  if (cipherRegions.length !== checksum.length) {
    return false;
  }

  for (let regionIndex in cipherRegions) {
    if (cipherRegions[regionIndex].length !== checksum[regionIndex]) {
      isValid = false;
      break;
    }
  }

  return isValid;
}

function parseChecksum(checksum: string): number[] {
  return checksum.split(",").map((char) => parseInt(char));
}

function printReports(reports: Report[]): void {
  reports.forEach(printReport);
}

function printReport(report: Report): void {
  console.log();
  console.log("Report:");
  console.log(report.cipher.join(""));
  console.log(report.checksum.join(","));
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const reports = readInput(inputLines);
const count = countReports(reports);

console.log(count);
