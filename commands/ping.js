import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('pong! 🎉')

export async function onMessage(interaction) {
  try {
    if (!interaction.isValid()) return;
    await interaction.reply('pong! 🎉');
  } catch (error) {
    console.error('Error:', error);
  }
}

export const execute = onMessage;