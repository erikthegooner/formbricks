/* eslint-disable @typescript-eslint/no-deprecated -- Keep this wrapper on the AI SDK object helper until the package has a typed generateText output abstraction. */
import { generateObject as generateObjectWithConfiguredModel } from "ai";
import { getAiModel } from "./provider";
import type { AIEnvironment, TGenerateObjectOptions, TGenerateObjectResult } from "./types";

export const generateObject = async <TObject = unknown>(
  options: TGenerateObjectOptions,
  environment?: AIEnvironment
): Promise<TGenerateObjectResult<TObject>> => {
  const request = {
    ...options,
    model: getAiModel(environment),
  } as Parameters<typeof generateObjectWithConfiguredModel>[0];

  return generateObjectWithConfiguredModel(request) as Promise<TGenerateObjectResult<TObject>>;
};
