import { beforeEach, describe, expect, test, vi } from "vitest";
import { generateObject } from "./object";

const mocks = vi.hoisted(() => ({
  generateObject: vi.fn(),
  getAiModel: vi.fn(),
}));

vi.mock("ai", () => ({
  generateObject: mocks.generateObject,
}));

vi.mock("./provider", () => ({
  getAiModel: mocks.getAiModel,
}));

describe("generateObject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAiModel.mockReturnValue({ provider: "test", modelId: "model" });
  });

  test("calls the AI SDK with the configured model", async () => {
    const schema = { type: "object" };
    const generated = { object: { title: "Survey" } };
    mocks.generateObject.mockResolvedValueOnce(generated);

    const result = await generateObject<{ title: string }>(
      {
        schema,
        prompt: "Generate a survey",
      },
      { AI_PROVIDER: "openai", AI_MODEL: "gpt-4.1-mini", AI_OPENAI_API_KEY: "key" }
    );

    expect(result).toBe(generated);
    expect(mocks.getAiModel).toHaveBeenCalledWith({
      AI_PROVIDER: "openai",
      AI_MODEL: "gpt-4.1-mini",
      AI_OPENAI_API_KEY: "key",
    });
    expect(mocks.generateObject).toHaveBeenCalledWith({
      schema,
      prompt: "Generate a survey",
      model: { provider: "test", modelId: "model" },
    });
  });
});
