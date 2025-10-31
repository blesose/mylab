import { detectNegativeTrend } from "../modules/mentalHealth/service/mentalHealth.analysis.js";
import assert from "assert";

describe("detectNegativeTrend()", () => {
  it("should return false for short data (<3 entries)", () => {
    assert.strictEqual(detectNegativeTrend([3, 2]), false);
  });

  it("should return false if mood is improving", () => {
    assert.strictEqual(detectNegativeTrend([2, 3, 4, 5]), false);
  });

  it("should return true if mood is dropping sharply", () => {
    assert.strictEqual(detectNegativeTrend([5, 4, 3, 2]), true);
  });

  it("should handle stable moods correctly", () => {
    assert.strictEqual(detectNegativeTrend([3, 3, 3, 3]), false);
  });

  it("should detect mild negative trends only if below threshold", () => {
    assert.strictEqual(detectNegativeTrend([4, 3.9, 3.8, 3.7]), false);
  });
});
