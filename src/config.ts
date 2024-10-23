import * as path from "@std/path";

const IGN_SCRIPTS_SUFFIX: string = "ignition\\script-python";

interface Config {
  ignitionProjectPath: string;
  pythonProjectPath: string;
  ignitionScriptsPath: string;
}

const getConfig = (): Config => {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync("config.json");
  const partialConfig = JSON.parse(decoder.decode(data));
  partialConfig.ignitionScriptsPath = path.join(
    partialConfig.ignitionProjectPath,
    IGN_SCRIPTS_SUFFIX,
  );
  return partialConfig as Config;
};

export const config = getConfig();
