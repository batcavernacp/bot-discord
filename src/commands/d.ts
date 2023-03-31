import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { CreateCompletionResponse } from "openai";
import { useOpenai } from "../utils/useOpenai";

const d = {
  data: new SlashCommandBuilder()
    .setName("d")
    .setDescription("Fale com a bat")
    .addStringOption((option) =>
      option.setName("mensagem").setDescription("Fala ae").setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const question = interaction.options.getString("mensagem");

    await interaction.reply(`Q: ${question}`);

    await interaction.channel?.sendTyping();

    const answer = await useOpenai({
      fn: (openai) =>
        openai.createCompletion(
          {
            model: "text-davinci-003",
            prompt: question,
            stream: true,
          },
          { responseType: "stream" }
        ),
      parse: (r: CreateCompletionResponse) => r.choices[0].text ?? "",
    });

    await interaction.editReply(`Q: ${question}:

A: ${answer}`);
  },
};

export default d;
