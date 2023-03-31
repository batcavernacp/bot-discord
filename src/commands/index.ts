import { CacheType, ChatInputCommandInteraction, Collection, SlashCommandBuilder } from "discord.js";
import fs from "fs";

const list: Command[] = fs
  .readdirSync(__dirname)
  .filter((file) => !file.startsWith("index"))
  .map((file) => file.split(".")[0])
  .map((file) => require("./" + file).default);

const commands = new Collection<any, Command>();

list.forEach((c) => commands.set(c.data.name, c));

export default commands;

export const comandos = list.map((c) => c.data.toJSON());

export type Command = {
  data: Partial<SlashCommandBuilder>,
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
}