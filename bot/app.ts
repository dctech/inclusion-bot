import { App, LogLevel } from "@slack/bolt";
import { handleMessage } from "./actions/message";
import { handleWhyDialog, WHY_MODAL_ACTION } from "./actions/whyDialog";
import { config } from "./triggers/triggers";

const {
  SLACK_TOKEN,
  SLACK_SIGNING_SECRET,
  PORT = "3000",
} = process.env;

const app = new App({
  token: SLACK_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
});

(async () => {
  await app.start(+PORT);

  const combinedTriggers = new RegExp(
    config.triggers.map(trigger => trigger.matches.source).join("|"),
    "i"
  );

  app.message(combinedTriggers, handleMessage);
  app.action(WHY_MODAL_ACTION, handleWhyDialog);
})();
