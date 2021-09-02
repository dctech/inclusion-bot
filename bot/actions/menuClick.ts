import { incrementMetric } from "newrelic";
import { AllMiddlewareArgs, BlockAction, OverflowAction, SlackActionMiddlewareArgs } from "@slack/bolt";

export const OVERFLOW_MENU_CLICK_ACTION_ID = "overflow_menu_click";

export async function handleMenuClick(event: SlackActionMiddlewareArgs<BlockAction<OverflowAction>> & AllMiddlewareArgs) {
  // We must acknowledge this event, or it will show as a UI error.
  await event.ack();

  incrementMetric("Actions/menuClick");
}
