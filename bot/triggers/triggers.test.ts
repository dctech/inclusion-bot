import { rawConfig } from "./triggers";

describe("Configuration file", () => {
  const yml = rawConfig;

  it("starts with a top-level triggers property", () => {
    expect(Object.keys(yml).length).toBe(3);
    expect(typeof yml.link).toBe("string");
    expect(typeof yml.message).toBe("string");
    expect(Array.isArray(yml.triggers)).toBe(true);
  });

  it("each item is an object, and each property of each object is a string", () => {
    const { triggers } = yml;

    triggers.forEach((trigger) => {
      expect(typeof trigger).toBe("object");

      const keys = Object.keys(trigger);
      const validKeys = ["matches", "alternatives", "ignore", "why"];
      const invalidKeys = keys.filter((key) => !validKeys.includes(key));

      expect(keys).toEqual(expect.arrayContaining(["matches", "alternatives"]));
      expect(invalidKeys).toHaveLength(0);

      if (keys.includes("ignore")) {
        expect(Array.isArray(trigger.ignore)).toBe(true);
      }

      if (keys.indexOf("why")) {
        expect(typeof trigger.why).toBe("string");
      }

      expect(Array.isArray(trigger.matches)).toBe(true);
      expect(trigger.matches.findIndex((v: any) => typeof v !== "string")).toBe(-1);

      expect(Array.isArray(trigger.alternatives)).toBe(true);
      expect(trigger.alternatives.findIndex((v: any) => typeof v !== "string")).toBe(-1);

      if (trigger.ignore) {
        expect(Array.isArray(trigger.ignore)).toBe(true);
        expect(trigger.ignore.findIndex(v => typeof v !== "string")).toBe(-1);
      }

      if (trigger.why) {
        expect(typeof trigger.why).toBe("string");
      }
    });
  });
});
