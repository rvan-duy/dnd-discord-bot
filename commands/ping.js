import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('pong! 🎉')

export async function onMessage(interaction) {
  try {
    await interaction.reply('pong! 🎉');
  } catch (error) {
    console.error('Error:', error);
  }
}

export const execute = onMessage;