import { parseStream } from "../utils/parseStream";
import { useMessagesBuilder } from "../utils/useMessages";
import { CommandBuilder } from "./index";

const useMessages = useMessagesBuilder();

const v: CommandBuilder = (builder, { openai }) => ({
  data: builder
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

    const { data } = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: getMessages(),
        stream: true,
      },
      { responseType: "stream" }
    );

    const answer = await parseStream(
      data,
      (d: any) => d.choices[0].delta.content ?? ""
    );

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
});

export default v;
