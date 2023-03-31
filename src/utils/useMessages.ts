import { ChatCompletionRequestMessage } from "openai";

interface IMessages {
  [key: string]: ChatCompletionRequestMessage[];
}

export const useMessagesBuilder = () => {
  const messages: IMessages = {};

  return (id: string) => {
    const addMessage = (message: ChatCompletionRequestMessage) => {
      if (!messages[id]) messages[id] = [];

      messages[id].push(message);
    };

    const getMessages = () => messages[id];

    return [getMessages, addMessage] as const;
  };
};
