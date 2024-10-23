import { config } from "../config.ts";
import { walkSync } from "@std/fs";
import { Module } from "../types.ts";
import * as path from "@std/path";

const getResourceJson = () => {
  return {
    "scope": "A",
    "version": 1,
    "restricted": true,
    "overridable": false,
    "files": [
      "code.py",
    ],
    "attributes": {
      "lastModification": {
        "actor": "",
        "timestamp": "",
      },
      "lastModificationSignature": "",
      "hintScope": 2,
    },
  };
};

export const getModules = (): Module[] => {
  const files = walkSync(config.pythonProjectPath, { match: [/.py$/] });
  return Array.from(files).map((file) => {
    return {
      name: file.name,
      path: path.dirname(path.relative(config.pythonProjectPath, file.path)),
    };
  });
};

const readCodeFromModule = (module: Module): string => {
  const textDecoder = new TextDecoder("utf-8");
  return textDecoder.decode(
    Deno.readFileSync(
      path.join(
        config.pythonProjectPath,
        module.path,
        module.name,
      ),
    ),
  );
};

const writeModule = (module: Module) => {
  const moduleFolderName = module.name.replace(".py", "");
  const modulePath = path.join(
    config.ignitionScriptsPath,
    module.path,
    moduleFolderName,
  );

  console.debug(`Creating module ${module.name}...`);
  Deno.mkdirSync(modulePath, { recursive: true });

  // Write the python module to the ignition module
  Deno.writeTextFile(
    path.join(modulePath, "code.py"),
    readCodeFromModule(module),
  );

  // Write the resource json to the ignition module
  Deno.writeTextFile(
    path.join(modulePath, "resource.json"),
    JSON.stringify(getResourceJson(), null, 2),
  );
};

export const transpile = () => {
  const modules = getModules();
  modules.forEach((module) => {
    writeModule(module);
  });
};
