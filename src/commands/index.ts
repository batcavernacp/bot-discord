import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder,
} from "discord.js";
import fs from "fs";
import { OpenAIApi } from "openai";

export type Command = {
  data: Partial<SlashCommandBuilder>;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
};
type CommandDependencies = {
  openai: OpenAIApi;
};

export type CommandBuilder = (
  builder: SlashCommandBuilder,
  depedencies: CommandDependencies
) => Command;

export default function buildCommands(
  depedencies: CommandDependencies
): Command[] {
  return fs
    .readdirSync(__dirname)
    .filter((file) => !file.startsWith("index"))
    .map((file) => file.split(".")[0])
    .map((file) =>
      require("./" + file).default(new SlashCommandBuilder(), depedencies)
    );
}

export const getCollection = (list: Command[]) => {
  const collection = new Collection<any, Command>();
  list.forEach((c) => collection.set(c.data.name, c));
  return collection;
};

export const getCommandData = (list: Command[]) =>
  list.map((c) => c.data.toJSON());
