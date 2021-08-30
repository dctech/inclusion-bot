import { AllMiddlewareArgs, GenericMessageEvent, SlackEventMiddlewareArgs } from "@slack/bolt";
import { WebAPICallResult } from "@slack/web-api";
import { capitalize } from "../helpers/capitalize";
import { config } from "../triggers/triggers"
import { OVERFLOW_MENU_CLICK_ACTION_ID } from "./menuClick";

export async function handleMessage(event: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) {
  const message = event.message as GenericMessageEvent;
  const { text } = message;
  const actions: Promise<WebAPICallResult>[] = [];

  const matches = config.triggers.map((trigger) => ({
    trigger,
    match: text.replace(trigger.ignore, "").match(trigger.matches)
  })).filter(x => !!x.match).map(({ trigger, match }) => ({
    trigger,
    text: match[0]
  }));

  if (matches.length === 0) {
    // This message contains only ignored items.
    return;
  }

  actions.push(event.client.reactions.add({
    name: config.emoji,
    channel: message.channel,
    timestamp: message.ts,
  }));

  // Pick a random alternative for each trigger word
  const pretexts = matches.map(({ trigger, text }) => {
    const random = Math.floor(Math.random() * trigger.alternatives.length);
    const alternative = trigger.alternatives[random];
    const why = (trigger.why || '').replace(/:TERM:/gi, capitalize(text));
    return `Instead of saying “${text.toLowerCase()},” how about *${alternative}*? ${why}`;
  });

  actions.push(event.client.chat.postEphemeral({
    user: message.user,
    channel: message.channel,
    thread_ts: message.thread_ts,
    icon_emoji: ":wave:",
    username: "Inclusion Bot",
    unfurl_links: false,
    unfurl_media: false,
    attachments: [
      {
        color: "#ffbe2e",
        blocks: pretexts.map((text, i) => ({
          type: "section",
          text: { type: "mrkdwn", text },
        })),
        fallback: text,
      },
      {
        color: "#2eb886",
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: config.message },
            accessory: {
              type: "overflow",
              options: config.links.map((link) => ({
                text: {
                  type: "plain_text",
                  text: link.text
                },
                url: link.url,
              })),
              action_id: OVERFLOW_MENU_CLICK_ACTION_ID,
            }
          }
        ],
        fallback: config.message,
      },
    ],
  }));

  try {
    await Promise.all(actions);
  }
  catch (error) {
    event.logger.error(error);
  }
}
