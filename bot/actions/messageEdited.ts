import { AllMiddlewareArgs, MessageChangedEvent, SlackEventMiddlewareArgs } from "@slack/bolt";

export async function handleMessageEdited(event: SlackEventMiddlewareArgs<'message_changed'> & AllMiddlewareArgs) {
  console.log(JSON.stringify(event, null, 2));
}
