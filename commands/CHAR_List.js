const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder, ActionRowBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('characters')
        .setDescription('Shows all characters'),

    async execute(interaction) {
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let user = interaction.user;
        let characters = users[user.id].characters;

        // get active character
        let active = users[user.id].active_character;


        let embed = new EmbedBuilder()
            .setTitle('Characters')
            .setColor(0x00FF00)
            .setDescription(`Here are all of your characters:\n> ${
                Object.keys(characters).map(character => {
                    if (character === active) {
                        return `**${character}** (active)`;
                    } else {
                        return character;
                    }
                }).join('\n ')}`)
            .setTimestamp()

        interaction.reply({embeds: [embed]});

    }

}