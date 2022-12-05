const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-character')
        .setDescription('Sets your active character')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the character')
            .setRequired(true)),

    async execute(interaction) {

        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let user = interaction.user;
        let name = interaction.options.getString('name');
        let characters = users[user.id].characters;
        let character = characters[name];

        if (character) {
            users[user.id].active_character = name;
            fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4));
            const embed = new EmbedBuilder()
                .setTitle('Active Character Set')
                .setColor(0x00FF00)
                .setDescription(`Your active character has been set to ${name}.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Character Not Found')
                .setColor(0xFF0000)
                .setDescription(`The character ${name} does not exist.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        }

    }
}