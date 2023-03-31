import { Collection } from "discord.js";
import fs from "fs";

const list = fs
  .readdirSync(__dirname)
  .filter((file) => !file.startsWith("index"))
  .map((file) => file.split(".")[0])
  .map((file) => require("./" + file).default);

const commands = new Collection();

list.forEach((c) => commands.set(c.data.name, c));

export default commands;

export const comandos = list.map((c) => c.data.toJSON());
