import { readFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";

const path = join(__dirname, "manifest.yml");
const yamlString = readFileSync(path, "utf-8");

/**
 * The manifest object returned from yaml.
 */
export const manifest = load(yamlString, { json: true }) as SlackManifest;

export type SlackManifest = {
  oauth_config: {
    scopes: {
      bot: string[];
    }
  }
};
