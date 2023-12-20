import * as fs from "fs";

const argv = process.argv.slice(2);
const inputFileName = argv[0] || "example.in";
const input = fs.readFileSync(`${__dirname}/${inputFileName}`, "utf-8");
const inputLines = input.split("\n");

enum Pulse {
  High = "high",
  Low = "low",
}

enum ModuleType {
  FlipFlop = "%",
  Conjunction = "&",
  Broadcaster = "broadcaster",
}

enum ModuleState {
  On = "on",
  Off = "off",
}

interface Signal {
  from: string;
  to: string;
  pulse: Pulse;
}

interface Module {
  type: ModuleType;
  connectedModules: string[];

  onConnectModules(modules: string[]): void;
  onInput(pulse: Pulse, from?: string): Signal[];
}

class BaseModule implements Module {
  type = ModuleType.FlipFlop;
  connectedModules: string[] = [];

  constructor(public name: string) {
    this.name = name;
  }

  onInput(pulse: Pulse, from?: string | undefined): Signal[] {
    if (pulse === Pulse.High) {
      highPulseSent++;
    } else if (pulse === Pulse.Low) {
      lowPulseSent++;
    }

    return [];
  }

  onConnectModules(modules: string[]): void {
    this.connectedModules = modules;
  }
}

class FlipFlop extends BaseModule {
  type = ModuleType.FlipFlop;
  state = ModuleState.Off;
  connectedModules: string[] = [];

  constructor(public name: string) {
    super(name);
  }

  onInput(pulse: Pulse, from: string): Signal[] {
    super.onInput(pulse, from);

    const outputSignals: Signal[] = [];
    // console.log(`${this.name} received ${pulse} pulse from ${from}`);

    // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
    if (pulse === Pulse.High) {
      // console.log(` > ${this.name} ignored ${pulse} pulse from ${from}`);
      return outputSignals;
    }

    // However, if a flip-flop module receives a low pulse, it flips between on and off.
    if (pulse === Pulse.Low) {
      if (this.state === ModuleState.Off) {
        // If it was off, it turns on and sends a high pulse.
        this.state = ModuleState.On;

        this.connectedModules.forEach((module) => {
          outputSignals.push({
            from: this.name,
            to: module,
            pulse: Pulse.High,
          });
        });

        // console.log(
        //   ` > ${this.name} turned on and sent ${
        //     Pulse.High
        //   } pulse to ${this.connectedModules.join(", ")}`,
        // );
      } else if (this.state === ModuleState.On) {
        // If it was on, it turns off and sends a low pulse.
        this.state = ModuleState.Off;

        this.connectedModules.forEach((module) => {
          outputSignals.push({
            from: this.name,
            to: module,
            pulse: Pulse.Low,
          });
        });

        // console.log(
        //   ` > ${this.name} turned off and sent ${
        //     Pulse.Low
        //   } pulse to ${this.connectedModules.join(", ")}`,
        // );
      }
    }

    return outputSignals;
  }
}

class Conjunction extends BaseModule {
  type = ModuleType.Conjunction;
  memory: Record<string, Pulse> = {};
  connectedModules: string[] = [];

  constructor(public name: string) {
    super(name);
  }

  setInputModule(module: string): void {
    // Initialize the memory for each input module
    this.memory[module] = Pulse.Low;
  }

  onInput(pulse: Pulse, from: string): Signal[] {
    super.onInput(pulse, from);

    const outputSignals: Signal[] = [];
    // console.log(`${this.name} received ${pulse} pulse from ${from}`);

    // When a pulse is received, the conjunction module first updates its memory for that input.
    this.memory[from] = pulse;

    // Then, if it remembers high pulses for all inputs, it sends a low pulse;
    if (Object.values(this.memory).every((pulse) => pulse === Pulse.High)) {
      this.connectedModules.forEach((module) => {
        outputSignals.push({
          from: this.name,
          to: module,
          pulse: Pulse.Low,
        });
      });

      // console.log(
      //   ` > ${this.name} sent ${
      //     Pulse.Low
      //   } pulse to ${this.connectedModules.join(", ")}`,
      // );
    } else {
      // otherwise, it sends a high pulse.
      this.connectedModules.forEach((module) => {
        outputSignals.push({
          from: this.name,
          to: module,
          pulse: Pulse.High,
        });
      });

      // console.log(
      //   ` > ${this.name} sent ${
      //     Pulse.High
      //   } pulse to ${this.connectedModules.join(", ")}`,
      // );
    }

    return outputSignals;
  }
}

class Broadcaster extends BaseModule {
  type = ModuleType.Broadcaster;
  connectedModules: string[] = [];

  constructor(public name: string) {
    super(name);
  }

  onInput(pulse: Pulse, from: string): Signal[] {
    super.onInput(pulse, from);

    const outputSignals: Signal[] = [];
    // console.log(`${this.name} received ${pulse} pulse from ${from}`);

    // When a pulse is received, the broadcaster module sends that pulse to all connected modules.
    this.connectedModules.forEach((module) => {
      outputSignals.push({
        from: this.name,
        to: module,
        pulse,
      });
    });

    // console.log(
    //   ` > ${this.name} sent ${pulse} pulse to ${this.connectedModules.join(
    //     ", ",
    //   )}`,
    // );

    return outputSignals;
  }
}

interface Configuration {
  name: string;
  type: ModuleType;
  connections: string[];
}

function readInput(input: string[]): Configuration[] {
  return input.map(parseInputLine);
}

function parseInputLine(line: string): Configuration {
  // Split the line by the -> separator
  const [module, connections] = line.split(" -> ");

  if (module === ModuleType.Broadcaster) {
    return {
      name: ModuleType.Broadcaster,
      type: ModuleType.Broadcaster,
      connections: connections.split(", "),
    };
  }

  const type = module[0] as ModuleType;
  const name = module.slice(1);

  return {
    name,
    type,
    connections: connections.split(", "),
  };
}

// Enough helpers, let's solve the problem
// ----------------------------------------

const configurations = readInput(inputLines);

// Now, let's create the modules based on the input configurations
const modules: Record<string, Module> = {};

configurations.forEach((configuration) => {
  const { name, type, connections } = configuration;

  // First, we need to create all the modules
  switch (type) {
    case ModuleType.Broadcaster:
      modules[name] = new Broadcaster(name);
      break;
    case ModuleType.FlipFlop:
      modules[name] = new FlipFlop(name);
      break;
    case ModuleType.Conjunction:
      modules[name] = new Conjunction(name);
      break;
  }

  // Then, we need to connect them
  modules[name].onConnectModules(connections);
});

// Now, we need one more final step, to init properly the memory of the conjunction modules

// First, we need to find all the conjunction modules
const conjunctionModules = (
  Object.values(modules).filter(
    (module) => module.type === ModuleType.Conjunction,
  ) as Conjunction[]
).map((module) => module.name);

// Then, we need to find all the modules that are connected to the conjunction modules
configurations.forEach((configuration) => {
  configuration.connections.forEach((connection) => {
    if (conjunctionModules.includes(connection)) {
      (modules[connection] as Conjunction).setInputModule(configuration.name);
    }
  });
});

// Finally, we need to run the simulation
const signals: Signal[][] = [];
let highPulseSent = 0;
let lowPulseSent = 0;

const ITERATIONS = 1000;
for (let i = 0; i < ITERATIONS; i++) {
  // First, we need to send a low pulse to the broadcaster
  const broadcaster = modules[ModuleType.Broadcaster] as Broadcaster;
  signals.push(broadcaster.onInput(Pulse.Low, "button"));

  // console.log(`Iteration ${i + 1} started`);

  // Now, let's go though the signals and process them
  while (signals.length > 0) {
    const currentSignals = signals.shift()!;
    const nextSignals: Signal[] = [];

    // Dump each signal on separate line
    // currentSignals.forEach((s) =>
    //   console.log(`${s.from} -> ${s.pulse} -> ${s.to}`),
    // );

    while (currentSignals.length > 0) {
      const currentSignal = currentSignals.shift()!;
      const { from, to, pulse } = currentSignal;

      const module = modules[to];
      if (module) {
        const outputSignal = module.onInput(pulse, from);

        nextSignals.push(...outputSignal);
      } else {
        // console.log(`Module ${to} not found (${from} -> ${pulse} -> ${to})})`);
        if (pulse === Pulse.High) {
          highPulseSent++;
        } else if (pulse === Pulse.Low) {
          lowPulseSent++;
        }
      }
    }

    if (nextSignals.length > 0) {
      signals.push(nextSignals);
      // console.log(
      //   "Next signals:",
      //   nextSignals.map((s) => `${s.from} -> ${s.pulse} -> ${s.to}`).join(", "),
      // );
    }
  }
}

// console.log("High pulse sent:", highPulseSent);
// console.log("Low pulse sent:", lowPulseSent);

const solution = highPulseSent * lowPulseSent;
console.log("Solution:", solution);
