import { useMessagesBuilder } from "../utils/useMessages";
import { CommandBuilder } from "./index";
import { parseStream } from "../utils/parseStream";

const useMessages = useMessagesBuilder();

const b: CommandBuilder = (builder, { openai }) => ({
  data: builder
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
      (d: any) => d.choices[0].delta.content
    );

    await interaction.editReply(`Q: ${question}
    
A: ${answer}`);

    addMessage({
      name: "bat",
      role: "system",
      content: answer,
    });
  },
});

export default b;
