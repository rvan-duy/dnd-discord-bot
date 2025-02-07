import { SlashCommandBuilder } from 'discord.js';
import { characterConfig} from '../character-config.js';

export const data = new SlashCommandBuilder()
  .setName('attack-hit')
  .setDescription('Checks if the attack hits the target')
  .addBooleanOption(option =>
    option
      .setName('advantage')
      .setDescription('Whether the attack has advantage')
      .setRequired(false)
  )
  .addBooleanOption(option =>
    option
      .setName('disadvantage')
      .setDescription('Whether the attack has disadvantage')
      .setRequired(false)
  );

const { strengthMod, proficiencyBonus } = characterConfig;

const rollD20 = () => Math.floor(Math.random() * 20) + 1;
const calculateTotal = (roll, strengthMod, proficiencyBonus) => roll + strengthMod + proficiencyBonus;

const buildResponse = (rolls, strengthMod, proficiencyBonus, total, advantage, disadvantage) => {
  let response = '';
  
  if (advantage) {
    response += 'Rolling with advantage:\n';
  } else if (disadvantage) {
    response += 'Rolling with disadvantage:\n';
  } else {
    response += 'Rolling normally:\n';
  }

  response += rolls.map((roll, index) => `- Roll ${index + 1} (d20): ${roll}\n`).join('');
  response += `- Strength Modifier: +${strengthMod}\n`;
  response += `- Proficiency Bonus: +${proficiencyBonus}\n\n`;
  response += `**Total: ${total}**`;
  return response;
};

export const execute = async interaction => {
  const advantage = interaction.options.getBoolean('advantage');
  const disadvantage = interaction.options.getBoolean('disadvantage');

  if (advantage && disadvantage) {
    await interaction.reply('You cannot have advantage and disadvantage at the same time.');
    return;
  }

  let rolls = [];
  let total;

  if (advantage) {
    rolls = [rollD20(), rollD20()];
    if (rolls[0] === 20 && rolls[1] === 20) {
      await interaction.reply('Both rolls were a 20! Critical hit!');
      return;
    }
    total = calculateTotal(Math.max(...rolls), strengthMod, proficiencyBonus);
  } else if (disadvantage) {
    rolls = [rollD20(), rollD20()];
    if (rolls[0] === 1 && rolls[1] === 1) {
      await interaction.reply('Both rolls were a 1! Oops... Remember sailors get to reroll ;)');
      return;
    }
    total = calculateTotal(Math.min(...rolls), strengthMod, proficiencyBonus);
  } else {
    rolls = [rollD20()];
    if (rolls[0] === 1) {
      await interaction.reply('Natural 1! Oops... Remember sailors get to reroll ;)');
      return;
    }
    total = calculateTotal(rolls[0], strengthMod, proficiencyBonus);
  }

  const response = buildResponse(rolls, strengthMod, proficiencyBonus, total, advantage, disadvantage);
  await interaction.reply(response);
};
