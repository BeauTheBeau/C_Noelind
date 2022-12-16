const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`bugs`)
        .setDescription(`Shows a list of active bugs.`),

    async execute(interaction) {
        let bugs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bugs.json'), 'utf8'));
        let embed = new EmbedBuilder()
            .setTitle(`Bugs`)
            .setColor(0x00FF00)
            .setDescription(`Here is a list of all active bugs:\n${
                Object.keys(bugs).map(bug => {
                    return bug;
                }).join('\n ')
            }`)
            .setTimestamp()

        await interaction.reply({embeds: [embed]});
    }

}