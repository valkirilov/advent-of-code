import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

function readInput(input: string[]): number[] {
  return input[0].split("").map(Number);
}

function generateDiskMap(diskSize: number[]): number[] {
  const diskMap: number[] = [];

  let currentId = 0;
  let isFileBlock = true;

  diskSize.forEach((blockSize) => {
    for (let i = 0; i < blockSize; i++) {
      if (isFileBlock) {
        diskMap.push(currentId);
      } else {
        diskMap.push(-1);
      }
    }

    isFileBlock = !isFileBlock;
    if (isFileBlock) {
      currentId++;
    }
  });

  return diskMap;
}

function defragmentDisk(diskMap: number[]): number[] {
  // Iterate over the disk map from left to right (and from right to left) and switch the places of each -1 block from the left with the first non -1 block from the right

  let left = 0;
  let right = diskMap.length - 1;

  while (left < right) {
    if (diskMap[left] === -1) {
      while (diskMap[right] === -1) {
        right--;
      }

      diskMap[left] = diskMap[right];
      diskMap[right] = -1;

      right--;
    }

    left++;
  }

  return diskMap;
}

function calculateChecksum(diskMap: number[]): number {
  // Calculate the checksum by summing the multiplying each non -1 block from the disk map to its index
  return diskMap.reduce((acc, block, index) => {
    if (block !== -1) {
      return acc + block * index;
    }

    return acc;
  }, 0);
}

function print(diskMap: number[]): void {
  const diskSize = diskMap.length;
  const diskSide = Math.sqrt(diskSize);
  const disk = diskMap.reduce((acc, block, index) => {
    if (index % diskSide === 0) {
      acc += "\n";
    }

    if (block === -1) {
      acc += ".";
    } else {
      acc += block;
    }

    return acc;
  }, "");

  console.log(disk);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const diskMap = generateDiskMap(parsedInput);

const defragmentedDisk = defragmentDisk(diskMap);
const checksum = calculateChecksum(defragmentedDisk);

console.log(checksum);

// 6283404596082 too high
