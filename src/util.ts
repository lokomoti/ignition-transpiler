import { Module } from "./types.ts";

const difference = (setA: Set<Module>, setB: Set<Module>): Set<Module> => {
  const diff = new Set<Module>(
    [...setA].filter((a) =>
      ![...setB].some((b) => b.name === a.name && b.path === a.path)
    ),
  );
  return diff;
};

export const getModulesToDelete = (
  pythonModules: Set<Module>,
  ignitionModules: Set<Module>,
): Set<Module> => {
  return difference(pythonModules, ignitionModules);
};
