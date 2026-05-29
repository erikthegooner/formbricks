import { Output, generateText as generateTextWithConfiguredModel } from "ai";
import { getAiModel } from "./provider";
import type { AIEnvironment, TGenerateObjectOptions, TGenerateObjectResult } from "./types";

export const generateObject = async <TObject = unknown>(
  options: TGenerateObjectOptions,
  environment?: AIEnvironment
): Promise<TGenerateObjectResult<TObject>> => {
  const { schema, schemaName, schemaDescription, output: _output, ...textOptions } = options;
  const request = {
    ...textOptions,
    model: getAiModel(environment),
    output: Output.object({
      schema,
      name: schemaName,
      description: schemaDescription,
    }),
  } as Parameters<typeof generateTextWithConfiguredModel>[0];

  const result = await generateTextWithConfiguredModel(request);
  const object = result.output as TObject;

  return {
    object,
    reasoning: result.reasoningText,
    finishReason: result.finishReason,
    usage: result.usage,
    warnings: result.warnings,
    request: result.request,
    response: result.response,
    providerMetadata: result.providerMetadata,
    toJsonResponse(init?: ResponseInit) {
      const headers = new Headers(init?.headers);
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json; charset=utf-8");
      }

      return new Response(JSON.stringify(object), {
        ...init,
        headers,
      });
    },
  };
};
