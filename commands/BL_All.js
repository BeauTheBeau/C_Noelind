const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklisted')
        .setDescription('Lists all blacklisted channels'),

    async execute(interaction) {

        let blacklisted = [];
        let channels = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blacklisted.json'), 'utf8'));
        for (const channel in channels) { if (channels[channel] === true) { blacklisted.push(`<#${channel}>`); }}

        const embed = new EmbedBuilder()
            .setTitle('Blacklisted Channels')
            .setColor(0x00FF00)
            .setDescription(`The following channels are blacklisted: **${blacklisted.join(', ')}**`)
            .setTimestamp()
        interaction.reply({embeds: [embed]});
    }
}