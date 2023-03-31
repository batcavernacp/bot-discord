import { parseStream } from "../utils/parseStream";
import { CommandBuilder } from "./index";

const d: CommandBuilder = (builder, { openai }) => ({
  data: builder
    .setName("d")
    .setDescription("Fale com a bat")
    .addStringOption((option) =>
      option.setName("mensagem").setDescription("Fala ae").setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("mensagem");

    await interaction.reply(`Q: ${question}`);

    await interaction.channel?.sendTyping();

    const { data } = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt: question,
        stream: true,
      },
      { responseType: "stream" }
    );

    const answer = await parseStream(data, (d) => d.choices[0].text);

    await interaction.editReply(`Q: ${question}:

A: ${answer}`);
  },
});

export default d;
