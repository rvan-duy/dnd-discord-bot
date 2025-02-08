import { Client as DiscordClient, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { registerCommands } from './utils/command-loader.js';
import { Client as PostgresClient } from 'pg';

const client = new DiscordClient({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  // setup postgressql connection with DATABASE_URL
  const pool = new PostgresClient({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // do a query to list all tables in the database
  pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'', (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Tables:');
    for (const row of res.rows) {
      console.log(row.table_name);
    }
  });

});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

registerCommands(client);

client.login(process.env.DISCORD_BOT_TOKEN);