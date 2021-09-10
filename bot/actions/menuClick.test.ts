import { handleMenuClick } from "./menuClick";
import newRelic from "newrelic";

jest.mock("newrelic", () => ({
  incrementMetric: jest.fn(),
}));

describe("handleMenuClick", () => {
  let mockEvent: any;

  beforeEach(() => {
    mockEvent = {
      ack: jest.fn(),
    };
  });

  it("acknowledges the event", async () => {
    await handleMenuClick(mockEvent);
    expect(mockEvent.ack).toHaveBeenCalled();
  });

  it("logs an event with New Relic", async () => {
    await handleMenuClick(mockEvent);
    expect(newRelic.incrementMetric).toHaveBeenCalledWith("Actions/menuClick");
  });
});
