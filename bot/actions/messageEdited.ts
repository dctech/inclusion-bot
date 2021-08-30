import { AllMiddlewareArgs, MessageChangedEvent, SlackEventMiddlewareArgs } from "@slack/bolt";
import { config } from "../triggers/triggers";

/**
 * Remove the emoji reaction from an edited message if the message no longer
 * causes the trigger.
 */
export async function handleMessageEdited(event: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) {
  const message = event.message as MessageChangedEvent;

  const [ auth, response ] = await Promise.all([
    event.client.auth.test(),
    event.client.reactions.get({
      channel: message.channel,
      timestamp: message.previous_message.ts,
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

  console.log(reaction);

  const ourReaction = reaction.users.find(user => user === auth.user_id);

  console.log(ourReaction);

  if (!ourReaction) {
    // We haven’t triggered on this message in the past.
    return;
  }

  console.log('continue');
}
