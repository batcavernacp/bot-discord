import { SlashCommandBuilder } from "discord.js";
import { useOpenai } from "../utils/useOpenai";
import { useMessagesBuilder } from "../utils/useMessages";
import { Command } from "./index";

const useMessages = useMessagesBuilder();

const b: Command = {
  data: new SlashCommandBuilder()
    .setName("b")
    .setDescription("Fale com a bat")
    .addStringOption((option) =>
      option.setName("mensagem").setDescription("Fala ae").setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("mensagem");

    const [getMessages, addMessage] = useMessages(interaction.user.id);

    addMessage({
      name: interaction.user.id,
      role: "user",
      content: question,
    });

    await interaction.reply(`Q: ${question}`);
    await interaction.channel?.sendTyping();

    const answer = await useOpenai({
      fn: (openai) =>
        openai.createChatCompletion(
          {
            model: "gpt-3.5-turbo",
            messages: getMessages(),
            stream: true,
          },
          { responseType: "stream" }
        ),
      parse: (r: any) => r.choices[0].delta.content ?? "",
    });

    await interaction.editReply(`Q: ${question}
    
A: ${answer}`);

    addMessage({
      name: "bat",
      role: "system",
      content: answer,
    });
  },
};

export default b;
