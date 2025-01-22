import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import 'dotenv/config';

const commands = [];
const commandsPath = path.resolve('commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if ('data' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`The command in ${file} is missing the "data" property.`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}