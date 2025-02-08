import { SlashCommandBuilder } from 'discord.js';
import { characterConfig } from '../character-config.js';
import con from '../utils/database-setup.js';

// logs fro adding /removing

export const data = new SlashCommandBuilder()
  .setName('boat')
  .setDescription('Manage your boat fund during a D&D session!')
  .addSubcommand(subcommand =>
    subcommand
      .setName('check')
      .setDescription('Check how high the boat fund is.')
  );

export const execute = async interaction => {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'check': {
      con.query(`SELECT * FROM boat WHERE id = 1`, async (err, rows) => {
        console.log("TESTSETST " + rows[0].fund);
        await interaction.reply(`You have ${rows[0].fund} gold in your boat fund.`);
      });
      break;
    }
    default: {
      await interaction.reply('Invalid subcommand.');
    }
  }
};
