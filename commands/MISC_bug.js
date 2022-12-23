const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const {ButtonStyle} = require("discord-api-types/v8");


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
        let bug = interaction.options.getString(`bug`);
        let bugID = bug;
        bug = bugs["CASE " + bug]

        let row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setCustomId(`done-${bugID}`)
                .setLabel('Mark DONE')
                .setStyle(ButtonStyle.Primary), new ButtonBuilder()
                .setCustomId(`progress-${bugID}`)
                .setLabel('Mark IN PROGRESS')
                .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
                .setCustomId(`delete-${bugID}`)
                .setLabel('Mark NOT A BUG')
                .setStyle(ButtonStyle.Danger),);

        let embed = new EmbedBuilder()
            .setTitle(`Bug #${bug}`)
            .setColor(0x00FF00)
            .setDescription(`\`\`\`**BUG** ${bug.bug}\`\`\`
            **STATUS:** ${bug.status}
`)
            .setTimestamp()

        interaction.reply({embeds: [embed], components: [row]});
    }
}