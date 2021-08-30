import { App, LogLevel, subtype } from "@slack/bolt";
import { CLOSE_MESSAGE_ACTION_ID, handleMessageClose } from "./actions/closeMessage";
import { handleMenuClick, OVERFLOW_MENU_CLICK_ACTION_ID } from "./actions/menuClick";
import { handleMessage } from "./actions/message";
import { handleMessageEdited } from "./actions/messageEdited";
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

  app.message(config.allTriggersRegExp, handleMessage);
  app.message(subtype("message_changed"), handleMessageEdited);
  app.action(OVERFLOW_MENU_CLICK_ACTION_ID, handleMenuClick);
  app.action(CLOSE_MESSAGE_ACTION_ID, handleMessageClose);
})();
