import { ChatCompletionRequestMessage } from "openai";

interface IMessages {
  [key: string]: ChatCompletionRequestMessage[];
}

export const useMessagesBuilder = () => {
  const messages: IMessages = {};
  
  return (id: string) => {
    if (!messages[id]) messages[id] = [];
    
    const addMessage = (message: ChatCompletionRequestMessage) => {
      messages[id].push(message);
    };

    const getMessages = () => messages[id];

    return [getMessages, addMessage] as const;
  };
};
