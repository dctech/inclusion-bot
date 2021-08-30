import { App, ExpressReceiver, LogLevel, subtype } from "@slack/bolt";
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

const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
  logLevel: LogLevel.INFO,
});

const app = new App({
  token: SLACK_TOKEN,
  receiver,
});

(async () => {
  await app.start(+PORT);

  app.message(config.allTriggersRegExp, handleMessage);
  app.message(subtype("message_changed"), handleMessageEdited);
  app.action(OVERFLOW_MENU_CLICK_ACTION_ID, handleMenuClick);
  app.action(CLOSE_MESSAGE_ACTION_ID, handleMessageClose);

  receiver.router.get("/", async (req, res) => {
    return res.redirect("https://github.com/dctech/inclusion-bot#readme");
  });
})();
