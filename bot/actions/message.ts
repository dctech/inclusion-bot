import { AllMiddlewareArgs, GenericMessageEvent, Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
import { config } from "../triggers/triggers"
import { WHY_MODAL_ACTION } from "./whyDialog";

export async function handleMessage(event: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) {
  const message = event.message as GenericMessageEvent;
  const { text } = message;

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

  event.client.reactions.add({
    name: "eyes",
    channel: message.channel,
    timestamp: message.ts,
  });

  // Pick a random alternative for each trigger word
  const pretexts = matches.map(({ trigger, text }) => {
    const random = Math.floor(Math.random() * trigger.alternatives.length);
    const alternative = trigger.alternatives[random];
    return `• Instead of saying “${text},” how about *${alternative}*?`;
  });

  event.client.chat.postEphemeral({
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
        blocks: pretexts.map((text, i) => {
          const block = {
            type: "section",
            text: { type: "mrkdwn", text },
          } as any;

          if (i === 0) {
            block.accessory = {
              type: "button",
              text: { type: "plain_text", text: "Why?" },
              value: matches.map(({ text: t }) => t).join("|"),
              action_id: WHY_MODAL_ACTION,
            };
          }
          return block;
        }),
        fallback: "fallback",
      },
      {
        color: "#2eb886",
        text: config.message,
        fallback: config.message,
      },
    ],
  });
}
