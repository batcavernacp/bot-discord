export const parseStream = async <T>(data: T, parse: (datas: T) => string) => {
  const streamCompletion = await import("@fortaine/openai/stream").then(
    (m) => m.streamCompletion
  );

  let resposta = "";

  for await (const response of streamCompletion(data as any)) {
    try {
      const parsed = JSON.parse(response);
      resposta += parse(parsed);
    } catch (error) {
      //
    }
  }

  return resposta;
};
