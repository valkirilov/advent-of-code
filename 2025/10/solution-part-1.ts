import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");
function readInput(
  input: string[],
): { indicators: string[]; buttons: number[][]; joltage: number[] }[] {
  return input.map(parseInput);
}

function parseInput(input: string): {
  indicators: string[];
  buttons: number[][];
  joltage: number[];
} {
  const data = input.split(" ");

  const indicators: string[] = [];
  const buttons: number[][] = [];
  const joltage: number[] = [];

  for (const item of data) {
    if (item.startsWith("[")) {
      indicators.push(...item.slice(1, -1).split(""));
    } else if (item.startsWith("(")) {
      buttons.push(item.slice(1, -1).split(",").map(Number));
    } else if (item.startsWith("{")) {
      joltage.push(...item.slice(1, -1).split(",").map(Number));
    }
  }

  return { indicators, buttons, joltage };
}

function transformInput(
  input: {
    indicators: string[];
    buttons: number[][];
    joltage: number[];
  }[],
): {
  indicators: number[];
  buttons: number[][];
} {
  const binaryIndicators = input.map(({ indicators }) =>
    indicatorsToBinary(indicators),
  );
  const binaryButtons = input.map(({ buttons, indicators }) =>
    buttonsToBinary(buttons, indicators.length),
  );

  return {
    indicators: binaryIndicators,
    buttons: binaryButtons,
  };
}

function indicatorsToBinary(indicators: string[]): number {
  const binaryString = indicators
    .map((indicator) => (indicator === "#" ? "1" : "0"))
    .reverse()
    .join("");
  return parseInt(binaryString, 2);
}

function buttonsToBinary(buttons: number[][], bitLength: number): number[] {
  return buttons.map((buttonArray) => {
    let result = 0;
    for (const button of buttonArray) {
      result |= 1 << button;
    }
    return result;
  });
}

function printBinary(num: number, padLength?: number): string {
  const binary = num.toString(2);
  return padLength ? binary.padStart(padLength, "0") : binary;
}

function findMinPresses(
  targetIndicator: number,
  availableButtons: number[],
): number {
  const numButtons = availableButtons.length;
  let minPresses = Infinity;

  // Try all possible combinations of button presses (2^numButtons possibilities)
  for (
    let buttonCombination = 0;
    buttonCombination < 1 << numButtons;
    buttonCombination++
  ) {
    let currentState = 0;
    let pressCount = 0;

    // Check each button position
    for (let buttonIndex = 0; buttonIndex < numButtons; buttonIndex++) {
      // If this button is pressed in current combination
      if (buttonCombination & (1 << buttonIndex)) {
        currentState ^= availableButtons[buttonIndex]; // Apply button's bit flips
        pressCount++;

        if (pressCount >= minPresses) {
          break;
        }
      }
    }

    // If we reached the target indicator state, update minimum
    if (currentState === targetIndicator) {
      minPresses = pressCount;
    }
  }

  return minPresses;
}

function countMinConfigurations(
  indicators: number[],
  buttons: number[][],
): number {
  return indicators.reduce((acc, indicator, index) => {
    const minPresses = findMinPresses(indicator, buttons[index]);

    // console.log(
    //   `Indicator ${index + 1}: min presses = ${
    //     minPresses === Infinity ? "impossible" : minPresses
    //   }`,
    // );

    return acc + (minPresses === Infinity ? 0 : minPresses);
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const { indicators, buttons } = transformInput(parsedInput);

// indicators.forEach((indicatorBinary, index) => {
//   console.log(
//     `Indicator ${index + 1}: ${printBinary(
//       indicatorBinary,
//       parsedInput[index].indicators.length,
//     )} (${indicatorBinary})`,
//   );
//   console.log(`Buttons for indicator ${index + 1}:`);
//   buttons[index].forEach((buttonBinary, btnIdx) => {
//     console.log(
//       `  Button ${btnIdx + 1}: ${printBinary(
//         buttonBinary,
//         parsedInput[index].indicators.length,
//       )} (${buttonBinary})`,
//     );
//   });
//   console.log();
// });

const result = countMinConfigurations(indicators, buttons);
console.log(result);
