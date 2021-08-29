import { readFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";

/**
 * Configuration for the phrases the bot reacts to and what it says about it.
 */
type TriggerConfig<TriggerType = RawTrigger | Trigger> = {
  /**
   * Describes the purpose of the bot and encourages people to learn more. This
   * is displayed after the list of triggering phrases and suggested alternatives.
   */
  message: string;

  /**
   * The list of phrases that will cause the bot to respond, what it should
   * ignore, and alternative words or phrases to suggest. Optionally, there is
   * a place to explain more about why the phrase triggered the bot's response.
   */
  triggers: TriggerType[];
};

/**
 * Represents a phrase which will cause the bot to respond, what it should
 * ignore, and alternative words or phrases to suggest — before it has been
 * parsed into regular expressions. Optionally, there is a place to explain
 * more about why the phrase triggered the bot's response.
 */
type RawTrigger = {
  /**
   * List all of the phrases that should trigger the response.
   */
  matches: string[];

  /**
   * Alternative phrases that should be suggested if this response is triggered.
   */
  alternatives: string[];

  /**
   * Any special cases of the phrases that should be ignored.
   */
  ignore?: string[];

  /**
   * Explains why the triggering phrase is problematic. The placeholder :TERM:
   * will be replaced with the specific text that triggered the bot to respond.
   */
  why?: string;
};

/**
 * Represents a phrase which will cause the bot to respond, what it should
 * ignore, and alternative words or phrases to suggest. Optionally, there is a
 * place to explain more about why the phrase triggered the bot's response.
 */
export type Trigger = {
  /**
   * List all of the phrases that should trigger the response.
   */
  matches: RegExp;

  /**
   * Alternative phrases that should be suggested if this response is triggered.
   */
  alternatives: string[];

  /**
   * Any special cases of the phrases that should be ignored.
   */
  ignore?: RegExp;

  /**
   * Explains why the triggering phrase is problematic. The placeholder :TERM:
   * will be replaced with the specific text that triggered the bot to respond.
   */
  why?: string;
};

const path = join(__dirname, "triggers.yml");
const yamlString = readFileSync(path, "utf-8");

/**
 * Configuration object before parsing regular expression text.
 */
export const rawConfig = load(yamlString, { json: true }) as TriggerConfig<RawTrigger>;

/**
 * Configuration object after parsing matchers into regular expressions.
 */
export const config = {
  ...rawConfig,
  triggers: rawConfig.triggers.map(({ ignore, matches, ...rest }) => ({
    ignore: ignore && RegExp(`\\b(${ignore.join("|")})\\b`, "i"),
    matches: RegExp(
      // The backend of this regex (starting at "(?=") is using a positive
      // lookahead to un-match things that are inside quotes (regular double
      // quotes, single quote, or smart quotes). You can play around with the
      // regex here: https://regexr.com/61eiq
      `\\b(${matches.join("|")})(?=[^"“”']*(["“”'][^"“”']*["“”'][^"“”']*)*$)\\b`,
      "i"
    ),
    ...rest
  }))
} as TriggerConfig<Trigger>;
