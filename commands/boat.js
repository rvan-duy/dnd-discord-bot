import { SlashCommandBuilder } from 'discord.js';
import con from '../utils/database-setup.js';

// logs fro adding /removing

export const data = new SlashCommandBuilder()
  .setName('boat-fund')
  .setDescription('Manage your boat fund during a D&D session!')
  .addSubcommand(subcommand =>
    subcommand
      .setName('check')
      .setDescription('Check how high the boat fund is.')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Add gold to the boat fund.')
      .addIntegerOption(option =>
        option
          .setName('amount')
          .setDescription('The amount of gold to add.')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Remove gold from the boat fund.')
      .addIntegerOption(option =>
        option
          .setName('amount')
          .setDescription('The amount of gold to remove.')
          .setRequired(true)
      )
  );

export const execute = async interaction => {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'check': {
      con.query(`SELECT * FROM boat WHERE id = 1`, async (err, rows) => {
        await interaction.reply(`You have ${rows.rows[0].fund} gold in your boat fund.`);
      });
      break;
    }
    case 'add': {
      const amount = interaction.options.getInteger('amount');

      con.query(`SELECT * FROM boat WHERE id = 1`, (err, rows) => {
        const newAmount = rows.rows[0].fund + amount;
        con.query(`UPDATE boat SET fund = ${newAmount} WHERE id = 1`, async err => {
          await interaction.reply(`Added ${amount} gold to the boat fund.\nThe new total is ${newAmount} gold.`);
        });
      });
      break;
    }
    case 'remove': {
      const amount = interaction.options.getInteger('amount');

      con.query(`SELECT * FROM boat WHERE id = 1`, (err, rows) => {
        const newAmount = rows.rows[0].fund - amount;
        con.query(`UPDATE boat SET fund = ${newAmount} WHERE id = 1`, async err => {
          await interaction.reply(`Removed ${amount} gold from the boat fund.\nThe new total is ${newAmount} gold.`);
        });
      });
      break;
    }
    default: {
      await interaction.reply('Invalid subcommand.');
    }
  }
};
