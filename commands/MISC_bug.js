const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`bug`)
        .setDescription(`Reports a bug.`)
        .addStringOption(option => option
            .setName(`bug`)
            .setDescription(`Bug case number.`)
            .setRequired(true)),

    async execute(interaction) {
        let bugs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bugs.json'), 'utf8'));
        let bug = interaction.options.getNumber(`bug`);
        let embed = new EmbedBuilder()
            .setTitle(`Bug #${bug}`)
            .setColor(0x00FF00)
            .setDescription(`\`\`\`${
                bugs[bug]
            }\`\`\``)
            .setTimestamp()

        interaction.reply({embeds: [embed]});
    }
}