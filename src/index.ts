import * as dotenv from "dotenv";
dotenv.config();

import express from "express";

import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import buildCommands, { getCollection, getCommandData } from "./commands";
import handleEvents from "./events";
import { openai } from "./openai";

const list = buildCommands({ openai });

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rest = new REST({ version: "10" }).setToken(token);

const comandos = getCommandData(list);

rest
  .put(Routes.applicationCommands(clientId), {
    body: comandos,
  })
  .then(() =>
    console.log(`Refreshed ${comandos.length} application (/) commands.`)
  );

handleEvents(client, getCollection(list));

client.login(token);
