const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-character')
        .setDescription('Deletes a character')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the character')
            .setRequired(true)),

    async execute(interaction) {
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let user = interaction.user;
        let name = interaction.options.getString('name');

        if (users[user.id]) {
            if (users[user.id].characters[name]) {
                delete users[user.id].characters[name];
                fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4));
                const embed = new EmbedBuilder()
                    .setTitle('Character Deleted')
                    .setColor(0x00FF00)
                    .setDescription(`The character ${name} has been deleted.`)
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
        } else {
            const embed = new EmbedBuilder()
                .setTitle('No Characters Found')
                .setColor(0xFF0000)
                .setDescription(`You have no characters.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        }
    }

}