import { SlashCommandBuilder } from 'discord.js';

// Store user-specific rage data
const rageData = new Map();

export const data = new SlashCommandBuilder()
  .setName('rage')
  .setDescription('Manage your Barbarian rages during a D&D session!')
  .addSubcommand(subcommand =>
    subcommand
      .setName('set')
      .setDescription('Set your total number of rages.')
      .addIntegerOption(option =>
        option
          .setName('amount')
          .setDescription('The total number of rages available.')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('use')
      .setDescription('Use one of your rages, reducing the remaining count.')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('reset')
      .setDescription('Reset your remaining rages to the full amount.')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('check')
      .setDescription('Check how many rages you have left.')
  );

export const execute = async interaction => {
  const userId = interaction.user.id;
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'set': {
      const totalRages = interaction.options.getInteger('amount');
      if (totalRages < 0) {
        await interaction.reply('The total number of rages must be 0 or higher.');
        return;
      }

      rageData.set(userId, { total: totalRages, remaining: totalRages });
      await interaction.reply(`Your total number of rages has been set to ${totalRages}.`);
      break;
    }
    case 'use': {
      const data = rageData.get(userId);
      if (!data) {
        await interaction.reply('You need to set your total number of rages first using `/rage set`.');
        return;
      }

      if (data.remaining <= 0) {
        await interaction.reply('You have no rages left! Consider resetting after a long rest.');
        return;
      }

      data.remaining -= 1;
      await interaction.reply(`You used a rage! You have ${data.remaining} rage(s) left.`);
      break;
    }
    case 'reset': {
      const data = rageData.get(userId);
      if (!data) {
        await interaction.reply('You need to set your total number of rages first using `/rage set`.');
        return;
      }

      data.remaining = data.total;
      await interaction.reply(`Your rages have been reset! You now have ${data.total} rage(s) available.`);
      break;
    }
    case 'check': {
      const data = rageData.get(userId);
      if (!data) {
        await interaction.reply('You need to set your total number of rages first using `/rage set`.');
        return;
      }

      await interaction.reply(`You have ${data.remaining} out of ${data.total} rage(s) left.`);
      break;
    }
    default: {
      await interaction.reply('Invalid subcommand.');
    }
  }
};
