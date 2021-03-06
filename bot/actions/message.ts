import newRelic from "newrelic";
import { AllMiddlewareArgs, GenericMessageEvent, SlackEventMiddlewareArgs } from "@slack/bolt";
import { WebAPICallResult } from "@slack/web-api";
import { capitalize } from "../helpers/capitalize";
import { config } from "../triggers/triggers"
import { CLOSE_MESSAGE_ACTION_ID } from "./closeMessage";
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
    newRelic.incrementMetric("Actions/message/ignoredTerm");
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
    newRelic.incrementMetric(`Actions/message/term/${text.toLowerCase()}`);
    return {
      suggestion: `Instead of saying “${text.toLowerCase()},” how about *${alternative}*?`,
      why
    };
  });

  actions.push(event.client.chat.postEphemeral({
    user: message.user,
    channel: message.channel,
    thread_ts: message.thread_ts,
    icon_emoji: ":wave:",
    username: "Inclusion Bot",
    unfurl_links: false,
    unfurl_media: false,
    fallback: pretexts.map(t => `${t.suggestion} ${t.why} ${config.message}`).join(" "),
    attachments: [
      {
        color: "#2eb886",
        blocks: [
          ...pretexts.map((trigger, i) => [
            {
              type: "section",
              text: { type: "mrkdwn", text: trigger.suggestion },
            },
            {
              type: "context",
              elements: [
                { type: "mrkdwn", text: `${trigger.why} ${config.message}` }
              ]
            }
          ]).flat(),
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Close this message"
                },
                action_id: CLOSE_MESSAGE_ACTION_ID,
                style: "primary"
              },
              {
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
            ]
          },
        ],
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
