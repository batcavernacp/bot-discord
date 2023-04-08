import { getCommonGames } from "../utils/getCommonGames";
import { CommandBuilder } from "./index";

const games: CommandBuilder = (builder) => ({
  data: builder
    .setName("games")
    .setDescription("Jogos em comum na steam")
    .addStringOption((option) =>
      option
        .setName("ids")
        .setDescription("IDs separados por virgula")
        .setRequired(true)
    ),
  async execute(interaction) {
    const ids = interaction.options.getString("ids")?.split(",");

    if (!ids) throw new Error("Missing ids");

    const [names, games] = await getCommonGames(ids.map(id => id.trim()));

    await interaction.channel?.sendTyping();

    await interaction.reply(
      `Jogos em comum de ${names.join(", ")}:

${games.join("\n")}`
    );
  },
});

export default games;
