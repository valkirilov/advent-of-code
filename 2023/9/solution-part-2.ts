import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Sequence {
  sequences: number[][]
}

function readInput(input: string[]): Sequence[] {
  return input.map((line) => {
    const sequence = line.split(" ").map((sequence) => parseInt(sequence, 10));
    
    return {
      sequences: [sequence.reverse()],
    };
  });
}

function generateSequencesDiffs(sequences: Sequence[]): Sequence[] {  
  return sequences.map((sequence) => generateSequenceDiffs(sequence));
}

function generateSequenceDiffs(input: Sequence): Sequence {
  const sequences = input.sequences;
  let currentSequence = input.sequences[0];
  
  while (!isSequenceFinite(currentSequence)) {
    const nextSequence = []

    for (let i = 1; i < currentSequence.length; i++) {
      const diff = currentSequence[i] - currentSequence[i - 1];
      nextSequence.push(diff);
    }

    sequences.push(nextSequence);
    currentSequence = sequences[sequences.length - 1]
  }

  return { sequences };
}

function isSequenceFinite(sequence: number[]): boolean {
  return sequence.every((number) => number === 0);
}

function generateSequenceNextValues(sequences: Sequence[]): Sequence[] {
  return sequences.map((sequence) => generateSequenceNextValue(sequence));
}

function generateSequenceNextValue(input: Sequence): Sequence {
  const sequences = input.sequences.reverse();
  
  sequences[0].push(0);

  for (let i = 1; i < sequences.length; i++) {
    const previousSequence = sequences[i-1];
    const previousSequenceLastValue = previousSequence[previousSequence.length - 1];
    
    const currentSequence = sequences[i];
    const currentSequenceLastValue = currentSequence[currentSequence.length - 1];

    currentSequence.push(previousSequenceLastValue + currentSequenceLastValue);
  }

  return { sequences: sequences };
}

function calculateScore(sequences: Sequence[]): number {
  let score = 0;

  sequences.forEach((sequence) => {
    const lastSequence = sequence.sequences[sequence.sequences.length - 1];
    const sequenceLastValue = lastSequence[lastSequence.length - 1];
    
    score += sequenceLastValue;
  });

  return score;
}

function printSequences(sequences: Sequence[]): void {
  sequences.forEach((sequence) => {
    console.log(sequence.sequences);
  });
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const sequencesWithDiffs = generateSequencesDiffs(parsedInput);
const sequencesWithNextValues = generateSequenceNextValues(sequencesWithDiffs);
const score = calculateScore(sequencesWithNextValues);

console.log(score);
