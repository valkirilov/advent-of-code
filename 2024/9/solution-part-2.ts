import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface MemoryBlock {
  id: number;
  position: number;
  size: number;
}

function readInput(input: string[]): number[] {
  return input[0].split("").map(Number);
}

function generateDiskMap(disk: number[]): [MemoryBlock[], MemoryBlock[]] {
  const files: MemoryBlock[] = [];
  const freeSpace: MemoryBlock[] = [];

  let fileId = 0;
  let isFileBlock = true;
  let index = 0;

  disk.forEach((blockSize) => {
    if (isFileBlock) {
      files.push({ id: fileId, position: index, size: blockSize });
      fileId++;
    } else {
      if (blockSize > 0) {
        freeSpace.push({ id: -1, position: index, size: blockSize });
      }
    }

    index += blockSize;
    isFileBlock = !isFileBlock;
  });

  return [files, freeSpace];
}

function defragmentDisk(
  files: MemoryBlock[],
  freeSpace: MemoryBlock[],
): [MemoryBlock[], MemoryBlock[]] {
  // Iterate over the files (from right to left) and switch the places of each file block with the first free space block from the left
  // The free space block must be at least as big as the file block
  // If there are no free space blocks big enough, the file block will remain in place

  for (let fileCursor = files.length - 1; fileCursor >= 0; fileCursor--) {
    const file = files[fileCursor];
    let freeSpaceCursor = 0;

    while (
      freeSpaceCursor < freeSpace.length - 1 &&
      freeSpace[freeSpaceCursor].position < file.position
    ) {
      const freeBlock = freeSpace[freeSpaceCursor];

      if (file.size <= freeBlock.size) {
        files[fileCursor].position = freeBlock.position;

        freeSpace[freeSpaceCursor].position += file.size;
        freeSpace[freeSpaceCursor].size -= file.size;

        // If the free space block new size is 0, remove it
        if (freeSpace[freeSpaceCursor].size === 0) {
          freeSpace.splice(freeSpaceCursor, 1);
        }
      }

      // If the free space block is not big enough, move to the next one
      freeSpaceCursor++;
    }
  }

  return [files, freeSpace];
}

function print(files: MemoryBlock[], freeSpace: MemoryBlock[]): void {
  const diskSize = 70;
  const diskMap: (number | string)[] = Array(diskSize).fill(".");

  files.forEach((file) => {
    for (let i = 0; i < file.size; i++) {
      diskMap[file.position + i] = file.id;
    }
  });

  console.log(diskMap.join(""));
}

function calculateChecksum(files: MemoryBlock[]): number {
  // Calculate the checksum by summing the multiplying each file block to its index
  return files.reduce((acc, file) => {
    for (let i = 0; i < file.size; i++) {
      acc += file.id * (file.position + i);
    }

    return acc;
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const [files, freeSpace] = generateDiskMap(parsedInput);
const [fragmentedFiles, remainingFreeSpace] = defragmentDisk(files, freeSpace);
const checksum = calculateChecksum(fragmentedFiles);
console.log(checksum);
