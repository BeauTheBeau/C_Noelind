const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Shows information about a character')
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

                let created = new Date(users[user.id].characters[name].created);
                let createdString = `${created.getMonth() + 1}/${created.getDate()}/${created.getFullYear()}`;

                const embed = new EmbedBuilder()
                    .setTitle('Character Information')
                    .setColor(0x00FF00)
                    .setDescription(`\`\`\`   Name: ${name}\n     HP: ${users[user.id].characters[name].hp} / ${users[user.id].characters[name].max_hp}\nCreated: ${createdString}\n\`\`\``)
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
}