import { readdirSync } from 'fs';
import path from 'path';

export const registerCommands = async client => {
  client.commands = new Map();

  const commandsPath = path.resolve('commands');
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`The command in ${file} is missing "data" or "execute" property.`);
    }
  }
};