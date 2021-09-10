import { handleMessageClose } from "./closeMessage";
import newRelic from "newrelic";

jest.mock("newrelic", () => ({
  incrementMetric: jest.fn(),
}));

describe("handleMessageClose", () => {
  let mockEvent: any;

  beforeEach(() => {
    mockEvent = {
      ack: jest.fn(),
      respond: jest.fn(),
    };
  });

  it("acknowledges the event", async () => {
    await handleMessageClose(mockEvent);
    expect(mockEvent.ack).toHaveBeenCalled();
  });

  it("responds with a message to close the message containing the button", async () => {
    await handleMessageClose(mockEvent);
    expect(mockEvent.respond).toHaveBeenCalledWith(expect.objectContaining({
      delete_original: true,
    }));
  });

  it("logs an event with New Relic", async () => {
    await handleMessageClose(mockEvent);
    expect(newRelic.incrementMetric).toHaveBeenCalledWith("Actions/messageClose");
  });
});
