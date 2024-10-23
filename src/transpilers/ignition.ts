import * as fs from "@std/fs";
import * as path from "@std/path";
import { config } from "../config.ts";
import { Module } from "../types.ts";

// Create module object from resource.json path
const createModule = (
  resourceFilePath: string,
): Module => {
  const relPath = path.relative(config.ignitionScriptsPath, resourceFilePath);
  const relPathParts = relPath.split(path.SEPARATOR);
  const moduleName = relPathParts[relPathParts.length - 2];
  const modulePath = path.join(
    ...relPathParts.slice(0, relPathParts.length - 2),
  );

  return {
    name: moduleName,
    path: modulePath,
  };
};

const readCodeFromModule = (module: Module): string => {
  const textDecoder = new TextDecoder("utf-8");

  return textDecoder.decode(
    Deno.readFileSync(
      path.join(
        config.ignitionScriptsPath,
        module.path,
        module.name,
        "code.py",
      ),
    ),
  );
};

// Write ignition module to python module in python project
const writeModule = (module: Module) => {
  Deno.mkdirSync(path.join(config.pythonProjectPath, module.path), {
    recursive: true,
  });

  Deno.writeTextFile(
    path.join(config.pythonProjectPath, module.path, module.name + ".py"),
    readCodeFromModule(module),
  );
};

// Check if ignition scripts path exists
const checkIgnitionScriptsPath = () => {
  if (!fs.existsSync(config.ignitionScriptsPath)) {
    console.error("Script directory missing: ", config.ignitionScriptsPath);
    Deno.exit(1);
  }
};

const getResourceJsons = (): string[] => {
  const files = fs.walkSync(config.ignitionScriptsPath, {
    "match": [/.json$/],
  });
  return Array.from(files, (file) => file.path);
};

// Get all modules from Ignition project
export const getModules = (): Module[] => {
  return getResourceJsons().map(createModule);
};

// Transpile Ignition project to Python project
export const transpile = (): void => {
  checkIgnitionScriptsPath();

  const modules = getModules();

  modules.forEach((module) => {
    writeModule(module);
  });
};
