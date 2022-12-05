const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-character')
        .setDescription('Creates a character')
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
                const embed = new EmbedBuilder()
                    .setTitle('Character Already Exists')
                    .setColor(0xFF0000)
                    .setDescription(`The character ${name} already exists.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            } else {
                users[user.id].characters[name] = {
                    name: name,
                    hp: 100,
                    max_hp: 100,
                    created: Date.now()
                };
                fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4));
                const embed = new EmbedBuilder()
                    .setTitle('Character Created')
                    .setColor(0x00FF00)
                    .setDescription(`The character ${name} has been created.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }
        } else {
            users[user.id] = {
                id: user.id,
                username: user.username,
                messages: 0,
                xp: 0,
                characters: {},
                inventory: {}
            };
            users[user.id].characters[name] = {
                name: name,
                hp: 100,
                max_hp: 100,
                created: Date.now()
            };
            fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4));
            const embed = new EmbedBuilder()
                .setTitle('Character Created')
                .setColor(0x00FF00)
                .setDescription(`The character ${name} has been created.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        }

    }

}