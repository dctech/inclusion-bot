import { AllMiddlewareArgs, MessageChangedEvent, SlackEventMiddlewareArgs } from "@slack/bolt";

export async function handleMessageEdited(event: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) {
  console.log(JSON.stringify(event, null, 2));
}
