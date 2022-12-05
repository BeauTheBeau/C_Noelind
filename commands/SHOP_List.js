const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Shows the shop'),

    async execute(interaction) {
        let shop = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shop.json'), 'utf8'));
        let shopList = '';

        for (const item in shop) {
            shopList += `**${item}:** ${shop[item]} XP\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle('Shop')
            .setColor(0x00FF00)
            .setDescription(shopList)
            .setTimestamp()

        interaction.reply({embeds: [embed]});
    }
}