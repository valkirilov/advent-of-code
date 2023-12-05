import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

interface Almanac {
  seeds: number[];
  rules: {
    [RuleType.SeedToSoil]: RuleRangeMapping[];
    [RuleType.SoilToFertilizer]: RuleRangeMapping[];
    [RuleType.FertilizerToWater]: RuleRangeMapping[];
    [RuleType.WaterToLight]: RuleRangeMapping[];
    [RuleType.LightToTemperature]: RuleRangeMapping[];
    [RuleType.TemperatureToHumidity]: RuleRangeMapping[];
    [RuleType.HumidityToLocation]: RuleRangeMapping[];
  };
}

interface RuleRange {
  min: number;
  max: number;
}

interface RuleRangeMapping {
  source: RuleRange;
  destination: RuleRange;
}

enum RuleType {
  SeedToSoil = 'seedToSoil',
  SoilToFertilizer = 'soilToFertilizer',
  FertilizerToWater = 'fertilizerToWater',
  WaterToLight = 'waterToLight',
  LightToTemperature = 'lightToTemperature',
  TemperatureToHumidity = 'temperatureToHumidity',
  HumidityToLocation = 'humidityToLocation',
}

function readInput(input: string[]): Almanac {
  let currentType: RuleType | string = '';
  let currentRuleMapping: RuleRangeMapping[] = [];
  
  return input.reduce((almanac: Almanac | any, line: string, lineIndex: number) => {
    // Start with the seeds
    if (line.indexOf('seeds:') === 0) {
      almanac.seeds = parseSeeds(line);

      return almanac;
    } 
    
    // Terminate current rule mapping reading
    else if (line.length === 0 || lineIndex === input.length - 1) { 
      almanac.rules[currentType] = currentRuleMapping;
      
      currentRuleMapping = [];
    }
    
    // Start new mapping type
    else if (line.indexOf('seed-to-soil') === 0) {
      currentType = RuleType.SeedToSoil;
    } else if (line.indexOf('soil-to-fertilizer') === 0) {
      currentType = RuleType.SoilToFertilizer;
    } else if (line.indexOf('fertilizer-to-water') === 0) {
      currentType = RuleType.FertilizerToWater;
    } else if (line.indexOf('water-to-light') === 0) {
      currentType = RuleType.WaterToLight;
    } else if (line.indexOf('light-to-temperature') === 0) {
      currentType = RuleType.LightToTemperature;
    } else if (line.indexOf('temperature-to-humidity') === 0) {
      currentType = RuleType.TemperatureToHumidity;
    } else if (line.indexOf('humidity-to-location') === 0) {
      currentType = RuleType.HumidityToLocation;
    } 
    
    // Parse current mapping info
    else {
      const parsedRuleMapping = parseMapInfo(line);

      currentRuleMapping = [...currentRuleMapping, parsedRuleMapping];
    }

    return almanac
  }, { seeds: [], rules: {} });
}

function parseSeeds(line: string): number[] {
  const [_title, seeds] = line.split(': ');
  
  return seeds.split(' ').map(Number);
}

function parseMapInfo(line: string): RuleRangeMapping {
  const [destination, source, range] = line.split(' ').map(Number);

  return {
    source: {
      min: source,
      max: source + range,
    }, 
    destination: {
      min: destination,
      max: destination + range,
    }
  };
}

interface SeedInfo {
  seed: number;
  soil: number;
  fertilizer: number;
  water: number;
  light: number;
  temperature: number;
  humidity: number;
  location: number;
}

function mapSeedsToRules(almanac: Almanac): SeedInfo[] {
  const { seeds, rules } = almanac;
  const { seedToSoil } = rules;
  const { soilToFertilizer } = rules;
  const { fertilizerToWater } = rules;
  const { waterToLight } = rules;
  const { lightToTemperature } = rules;
  const { temperatureToHumidity } = rules;
  const { humidityToLocation } = rules;

  return seeds.map((seed: number) => {
    const soil = findMappedRule(seedToSoil, seed);
    const fertilizer = findMappedRule(soilToFertilizer, soil);
    const water = findMappedRule(fertilizerToWater, fertilizer);
    const light = findMappedRule(waterToLight, water);
    const temperature = findMappedRule(lightToTemperature, light);
    const humidity = findMappedRule(temperatureToHumidity, temperature);
    const location = findMappedRule(humidityToLocation, humidity);

    return {
      seed,
      soil,
      fertilizer,
      water,
      light,
      temperature,
      humidity,
      location,
    }
  });
}

function findMappedRule(ruleMappings: RuleRangeMapping[], value: number): number {
  const rule = ruleMappings.find((ruleMapping: RuleRangeMapping) => {
    const { source } = ruleMapping;

    return value >= source.min && value <= source.max;
  });

  if (!rule) {
    return value;
  }


  const { source, destination } = rule;
  const rangeOffset = source.max - value

  return destination.max - rangeOffset;
}

function findSmallestLocation(almanac: SeedInfo[]): number {
  return almanac.reduce((smallestLocation: number, seedInfo: SeedInfo) => {
    if (seedInfo.location < smallestLocation) {
      return seedInfo.location;
    }

    return smallestLocation;
  }, Infinity);
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const parsedInput = readInput(inputLines);
const parsedAlmanac = mapSeedsToRules(parsedInput)
const solution = findSmallestLocation(parsedAlmanac);

console.log(solution);
