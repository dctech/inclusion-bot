import { AllMiddlewareArgs, BlockAction, ButtonAction, SlackActionMiddlewareArgs } from "@slack/bolt";
import { capitalize } from "../helpers/capitalize";
import { config } from "../triggers/triggers";

export const WHY_MODAL_ACTION = "inclusion_modal";
const defaultExplanation = `":TERM:" doesn’t have an explanation written out yet. Please file an issue if you’re confused!`;

export async function handleWhyDialog(event: SlackActionMiddlewareArgs<BlockAction<ButtonAction>> & AllMiddlewareArgs) {
  await event.ack();

  const action = event.action;
  const matchWords = action.value.split("|");

  const explanations = matchWords.map((word) => {
    const { trigger } = config.triggers.map((trigger) => ({
      trigger,
      match: word.match(trigger.matches)
    })).filter(x => !!x.match).pop();

    if (!trigger) {
      // Something is amiss — we have a word which triggered the response but
      // doesn’t appear in any trigger’s word match list.
      return;
    }

    const why = trigger.why || defaultExplanation;
    return why.replace(/:TERM:/gi, capitalize(word));
  });

  const blocks = explanations.map((why) => [
    {
      type: "section",
      text: { type: "mrkdwn", text: why },
    },
    {
      type: "divider"
    },
  ]).flat() as any[];

  // Remove the last divider and replace it with a link to learn more.
  blocks.pop();
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `<${config.link}|Read more> about this bot or file an issue.`,
      },
    ],
  });

  event.client.views.open({
    trigger_id: event.body.trigger_id,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Inclusion Bot"
      },
      blocks
    }
  });
};
