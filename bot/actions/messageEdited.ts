import newRelic from "newrelic";
import { AllMiddlewareArgs, GenericMessageEvent, MessageChangedEvent, SlackEventMiddlewareArgs } from "@slack/bolt";
import { config } from "../triggers/triggers";

/**
 * Remove the emoji reaction from an edited message if the message no longer
 * causes the trigger.
 */
export async function handleMessageEdited(event: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) {
  const messageChanged = event.message as MessageChangedEvent;
  const message = messageChanged.message as GenericMessageEvent;

  const [ auth, response ] = await Promise.all([
    event.client.auth.test(),
    event.client.reactions.get({
      channel: messageChanged.channel,
      timestamp: message.ts,
      full: true,
    }),
  ])

  if (!response.message?.reactions?.length) {
    // This edited message has no reactions, so it can’t be one we’re looking at
    return;
  }

  const reaction = response.message.reactions.find((reaction) => {
    return reaction.name === config.emoji;
  });

  if (!reaction) {
    // This message does not have any reactions of the same type as ours.
    return;
  }

  const ourReaction = reaction.users.find(user => user === auth.user_id);

  if (!ourReaction) {
    // We haven’t triggered on this message in the past.
    return;
  }

  if (!message.text.match(config.allTriggersRegExp)) {
    // The user has adjusted their language and it no longer matches our
    // triggers.
    newRelic.incrementMetric("Actions/messageEdited/termRemoved");
    await event.client.reactions.remove({
      name: config.emoji,
      channel: messageChanged.channel,
      timestamp: message.ts,
    });
  }
}
