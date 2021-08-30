import { readFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";

/**
 * Configuration for the phrases the bot reacts to and what it says about it.
 */
type TriggerConfig<TriggerType = RawTrigger | Trigger> = {
  /**
   * The emoji that Inclusion Bot will react to the triggered message with. This
   * lets folks who may be offended by the content of the message know that
   * they do not have to speak up and expend emotional energy.
   */
  emoji: string;

  /**
   * Describes the purpose of the bot and encourages people to learn more. This
   * is displayed after the list of triggering phrases and suggested alternatives.
   */
  message: string;

  /**
   * Describes between 2 and 5 links which are attached to an overflow menu
   * next to the message displayed after the list of triggering phrases.
   */
  links: OverflowLink[];

  /**
   * The list of phrases that will cause the bot to respond, what it should
   * ignore, and alternative words or phrases to suggest. Optionally, there is
   * a place to explain more about why the phrase triggered the bot's response.
   */
  triggers: TriggerType[];

  /**
   * A regular expression representing all triggers.
   */
  allTriggersRegExp: RegExp;
};

/**
 * Represents a link which is attached to an overflow menu next to the message
 * displayed after the list of triggering phrases.
 */
type OverflowLink = {
  /**
   * Plain text to show in the menu.
   */
  text: string;

  /**
   * URL to navigate the user to upon selecting the menu item.
   */
  url: string;
}

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

const mappedTriggers = rawConfig.triggers.map(({ ignore, matches, ...rest }) => ({
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
}));

/**
 * Configuration object after parsing matchers into regular expressions.
 */
export const config = {
  ...rawConfig,
  triggers: mappedTriggers,
  allTriggersRegExp: new RegExp(
    mappedTriggers.map(trigger => trigger.matches.source).join("|"),
    "i"
  )
} as TriggerConfig<Trigger>;
