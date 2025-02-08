import { SlashCommandBuilder } from 'discord.js';
import { characterConfig } from '../character-config.js';

export const data = new SlashCommandBuilder()
  .setName('attack-damage')
  .setDescription('Calculates the damage of an attack')
  .addStringOption(option =>
    option
      .setName('weapon')
      .setDescription('The weapon used for the attack')
      .setRequired(true)
  );

const { strengthMod } = characterConfig;
const rageBonus = 2; // Rage bonus

// Function to roll damage and provide a breakdown
const rollDamage = (diceSize) => {
  const diceRoll = Math.floor(Math.random() * diceSize) + 1; // Base dice roll
  const totalDamage = diceRoll + strengthMod + rageBonus; // Total damage calculation
  let rerollMessage = '';

  // Check if the base dice roll is 1
  if (diceRoll === 1) {
    rerollMessage = `\n\nYou rolled a 1! But as a sailor, you get to reroll.`;
  }

  // Breakdown of damage components
  const damageBreakdown = `
- Dice Roll (1d${diceSize}): ${diceRoll}
- Strength Modifier: +${strengthMod}
- Rage Bonus: +${rageBonus}\n
**Total Damage: ${totalDamage}**`;

  return { damage: totalDamage, breakdown: damageBreakdown, rerollMessage };
};

export const execute = async interaction => {
  const weapon = interaction.options.getString('weapon');

  let damage;
  let reply;

  switch (weapon) {
    case 'claws':
      const clawsRoll = rollDamage(6); // 1d6
      damage = clawsRoll.damage;
      reply = `You clawed the enemy!${clawsRoll.breakdown}${clawsRoll.rerollMessage}\nRemember clawing can be done twice.`;
      break;
    case 'bite':
      const biteRoll = rollDamage(8); // 1d8
      damage = biteRoll.damage;
      reply = `You bit the enemy!${biteRoll.breakdown}\nYou healed for ${characterConfig.proficiencyBonus} health.${biteRoll.rerollMessage}`;
      break;
    case 'tail':
      const tailRoll = rollDamage(8); // 1d8
      damage = tailRoll.damage;
      reply = `You hit the enemy with your tail!${tailRoll.breakdown}${tailRoll.rerollMessage}`;
      break;
    default:
      await interaction.reply('Invalid weapon.');
      return;
  }

  await interaction.reply(reply);
};