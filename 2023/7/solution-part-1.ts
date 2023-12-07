import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum HandType {
  FiveKind = 'five-of-a-kind',
  FourKind = 'four-of-a-kind',
  FullHouse = 'full-house',
  ThreeKind = 'three-of-a-kind',
  TwoPair = 'two-pair',
  OnePair = 'one-pair',
  HighCard = 'high-card',
}

const Card: Record<string, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 11,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
}

const HandTypeRank: Record<HandType, number> = {
  [HandType.FiveKind]: 7,
  [HandType.FourKind]: 6,
  [HandType.FullHouse]: 5,
  [HandType.ThreeKind]: 4,
  [HandType.TwoPair]: 3,
  [HandType.OnePair]: 2,
  [HandType.HighCard]: 1,
}

interface Game {
  hand: string;
  bid: number;
  handType?: HandType;
  rank?: number;
}


function readInput(input: string[]): Game[] {
  return input.map(parseGame);
}

function parseGame(line: string): Game {
  const [hand, bid] = line.split(" ");
  
  return {
    hand,
    bid: parseInt(bid),
  };
}

function evaluateHandTypes(games: Game[]): Game[] {
  return games.map(evaluateHandType);
}

function evaluateHandType(game: Game): Game {
  const hand = game.hand.split("");
  const handType = getHandType(hand);

  return {
    ...game,
    handType,
  }
}

function getHandType(hand: string[]): HandType {
  const cardCount = getCardCount(hand);

  const handType = getFiveKind(cardCount) ||
    getFourKind(cardCount) ||
    getFullHouse(cardCount) ||
    getThreeKind(cardCount) ||
    getTwoPair(cardCount) ||
    getOnePair(cardCount) ||
    HandType.HighCard;

  return handType;
}

function getCardCount(hand: string[]): number[] {
  const cardCount = new Array(15).fill(0);

  for (const card of hand) {
    const cardIndex = Card[card];
    cardCount[cardIndex]++;
  }

  return cardCount.sort((a, b) => b - a);
}


function getFiveKind(cardCount: number[]): HandType | undefined {
  if (cardCount[0] === 5) {
    return HandType.FiveKind;
  }
}

function getFullHouse(cardCount: number[]): HandType | undefined {
  if (cardCount[0] === 3 && cardCount[1] === 2) {
    return HandType.FullHouse;
  }
}

function getFourKind(cardCount: number[]): HandType | undefined {
  if (cardCount[0] === 4) {
    return HandType.FourKind;
  }
}

function getThreeKind(cardCount: number[]): HandType | undefined {
  if (cardCount[0] === 3) {
    return HandType.ThreeKind;
  }
}

function getTwoPair(cardCount: number[]): HandType | undefined {
  if (cardCount[0] === 2 && cardCount[1] === 2) {
    return HandType.TwoPair;
  }
}

function getOnePair(cardCount: number[]): HandType | undefined {
  if (cardCount[0] === 2) {
    return HandType.OnePair;
  }
}

function orderGamesByRank(games: Game[]): Game[] {
  return games.sort((a, b) => {
    if (a.handType === b.handType) {
      return compareHandsByCardsRank(a, b);
    }

    return HandTypeRank[a.handType!] - HandTypeRank[b?.handType!];
  }).map((game, index) => ({
    ...game,
    rank: index + 1,
  }));
}

function compareHandsByCardsRank(a: Game, b: Game): number {
  const aHand = a.hand.split("");
  const bHand = b.hand.split("");

  for (let i = 0; i < aHand.length; i++) {
    const aCard = Card[aHand[i]];
    const bCard = Card[bHand[i]];

    if (aCard !== bCard) {
      return aCard - bCard;
    }
  }

  return 0;
}

function calculateScore(games: Game[]): number {
  return games.reduce((score, game) => {
    const rank = game.rank!;
    const bid = game.bid;

    return score + (rank * bid);
  }, 0);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const games = evaluateHandTypes(parsedInput);
const rankedGames = orderGamesByRank(games);
const score = calculateScore(rankedGames);

console.log(score);
