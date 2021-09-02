import newrelic from "newrelic";
import { App, ExpressReceiver, Installation as InstallationType, LogLevel, subtype } from "@slack/bolt";
import { Sequelize } from "sequelize";
import { InstallationFactory } from "./models/installation";
import { CLOSE_MESSAGE_ACTION_ID, handleMessageClose } from "./actions/closeMessage";
import { handleMenuClick, OVERFLOW_MENU_CLICK_ACTION_ID } from "./actions/menuClick";
import { handleMessage } from "./actions/message";
import { handleMessageEdited } from "./actions/messageEdited";
import { manifest } from "./manifest/manifest";
import { config } from "./triggers/triggers";

const {
  SLACK_SIGNING_SECRET,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  APP_STATE_SECRET,
  DATABASE_URL,
  PORT = "3000",
  NODE_ENV,
} = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: NODE_ENV === "production"
    // Heroku does not support verifiable certificates
    ? { ssl: { rejectUnauthorized: false } }
    : {},
});

const Installation = InstallationFactory(sequelize);

const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET,
  clientId: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  stateSecret: APP_STATE_SECRET,
  scopes: manifest.oauth_config.scopes.bot,
  logLevel: LogLevel.INFO,
  installationStore: {
    storeInstallation: async (installation) => {
      await Installation.create({
        id: installation.isEnterpriseInstall
          ? installation.enterprise.id
          : installation.team.id,
        isEnterpriseInstallation: installation.isEnterpriseInstall,
        installationObject: installation
      });
    },
    fetchInstallation: async (query) => {
      const installation = await Installation.findByPk(
        query.isEnterpriseInstall ? query.enterpriseId : query.teamId
      );

      return installation.installationObject as InstallationType;
    },
    deleteInstallation: async (query) => {
      const installation = await Installation.findByPk(
        query.isEnterpriseInstall ? query.enterpriseId : query.teamId
      );

      await installation.destroy();
    }
  }
});

// Trust and use Heroku’s X-Forwarded-* headers.
receiver.app.set("trust proxy", true);

const app = new App({ receiver });

(async () => {
  await sequelize.authenticate();
  await app.start(+PORT);

  app.message(config.allTriggersRegExp, handleMessage);
  app.message(subtype("message_changed"), handleMessageEdited);
  app.action(OVERFLOW_MENU_CLICK_ACTION_ID, handleMenuClick);
  app.action(CLOSE_MESSAGE_ACTION_ID, handleMessageClose);

  receiver.router.get("/", async (req, res) => {
    return res.redirect("https://github.com/dctech/inclusion-bot#readme");
  });

  // Until we can use the directInstall option, we need to use a custom handler
  // to return a 302.
  receiver.router.get("/install", async (req, res) => {
    return res.redirect(await receiver.installer.generateInstallUrl({
      scopes: manifest.oauth_config.scopes.bot,
      redirectUri: `${req.protocol}://${req.hostname}/slack/oauth_redirect`,
    }));
  });
})();
