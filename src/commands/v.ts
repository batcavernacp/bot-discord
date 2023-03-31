import { SlashCommandBuilder } from "discord.js";
import { useMessagesBuilder } from "../utils/useMessages";
import { useOpenai } from "../utils/useOpenai";
import { Command } from "./index";

const useMessages = useMessagesBuilder();

const v: Command = {
  data: new SlashCommandBuilder()
    .setName("v")
    .setDescription("Fale com a bat (tts)")
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

    await interaction.reply(`Q: ${question}
    `);
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

    await interaction.channel.send({
      content: `A: ${answer}`,
      tts: true,
    });

    addMessage({
      name: "bat",
      role: "system",
      content: answer,
    });
  },
};

export default v;
