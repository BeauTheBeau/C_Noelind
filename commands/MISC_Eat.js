const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eat")
        .setDescription("Eat food to restore HP.")
        .addStringOption(option => option
            .setName("character")
            .setDescription("The character that will be doing the eating.")
            .setRequired(true)),

    async execute(interaction) {
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let user = interaction.user;
        let name = interaction.options.getString('character');

        if (users[user.id]) {

            console.log(users[user.id].characters[name])

            if (users[user.id].characters[name]) {
                if (users[user.id].characters[name].hp < users[user.id].characters[name].max_hp) {

                    if (users[user.id].characters[name].hp < 25) {
                        return interaction.reply({content: "Your HP is too low! Visit a Lekar instead.", ephemeral: true});
                    }

                    users[user.id].characters[name].hp += 1;
                    users[user.id].characters[name].lastAte = Math.floor(Date.now() / 1000);

                    console.log(users[user.id].characters[name].lastAte);

                    interaction.reply(`You fed ${name} and restored 10 HP!`);

                }
            }

            else {
                const embed = new EmbedBuilder()
                    .setTitle('Character Not Found')
                    .setColor(0xFF0000)
                    .setDescription(`The character ${name} does not exist.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }
        }
        else {
            const embed = new EmbedBuilder()
                .setTitle('User Not Found')
                .setColor(0xFF0000)
                .setDescription(`You do not have any characters.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        }

    }
}