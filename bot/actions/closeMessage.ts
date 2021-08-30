import { AllMiddlewareArgs, BlockAction, ButtonAction, SlackActionMiddlewareArgs } from "@slack/bolt";

export const CLOSE_MESSAGE_ACTION_ID = "close_ephemeral_message";

export async function handleMessageClose(event: SlackActionMiddlewareArgs<BlockAction<ButtonAction>> & AllMiddlewareArgs) {
  // We must acknowledge this event, or it will show as a UI error.
  event.ack();

  await event.respond({
    delete_original: true
  });
}
