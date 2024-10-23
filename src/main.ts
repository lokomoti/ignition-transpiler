import {
  getModules as getIgnitionModules,
  transpile as ignitionTranspile,
} from "./transpilers/ignition.ts";

import { transpile as pythonTranspile } from "./transpilers/python.ts";

const logIgnitionModules = () => {
  console.log(getIgnitionModules());
};

const options = new Map<string, CallableFunction>(
  [
    ["--from-ignition", ignitionTranspile],
    ["--to-ignition", pythonTranspile],
    ["--get-ignition-modules", logIgnitionModules],
  ],
);

const args = Deno.args;

if (args.length === 0) {
  console.error("No arguments provided");
  Deno.exit(1);
}

const call = options.get(args[0]);

if (call === undefined) {
  console.error("Invalid argument");
  Deno.exit(1);
}

call();
