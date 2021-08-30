import { AllMiddlewareArgs, MessageChangedEvent, SlackEventMiddlewareArgs } from "@slack/bolt";
import { config } from "../triggers/triggers";

/**
 * Remove the emoji reaction from an edited message if the message no longer
 * causes the trigger.
 */
export async function handleMessageEdited(event: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) {
  const message = event.message as MessageChangedEvent;

  const auth = await event.client.auth.test();

  console.log(auth);

  const response = await event.client.reactions.get({
    channel: message.channel,
    timestamp: message.ts,
  });

  if (!response.message?.reactions?.length) {
    // This edited message has no reactions, so it can’t be one we’re looking at
    return;
  }

  const reaction = response.message.reactions.find((reaction) => {
    return reaction.name === config.emoji;
  });

  console.log(reaction);

  //const ourReaction = reaction.users.find(user => user === )
}
