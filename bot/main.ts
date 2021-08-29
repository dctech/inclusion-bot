import { App, LogLevel } from "@slack/bolt";

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
})();
