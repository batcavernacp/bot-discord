import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION
});

const openai = new OpenAIApi(configuration);

type Create =
  | typeof openai.createCompletion
  | typeof openai.createChatCompletion;

type Test2Options<T extends Create> = {
  fn: (openai: OpenAIApi) => ReturnType<T>;
  parse: (choices: Awaited<ReturnType<T>>[`data`]) => string;
};

export const useOpenai = async <T extends Create>({
  fn,
  parse,
}: Test2Options<T>) => {
  const completion = await fn(openai);
  const streamCompletion = await import("@fortaine/openai/stream").then(
    (m) => m.streamCompletion
  );

  let resposta = "";

  for await (const response of streamCompletion(completion.data as any)) {
    try {
      const parsed = JSON.parse(response);
      resposta += parse(parsed);
    } catch (error) {
      //
    }
  }

  return resposta;
};
