const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("heal")
        .setDescription("Heal a character.")
        .addMentionableOption(option => option
            .setName("user")
            .setDescription("The user whose character will be healed.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("character")
            .setDescription("The character that will be healed.")
            .setRequired(true)),

    async execute(interaction) {

        // get the lekars list from users
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let lekars = users.lekars;

        // get the character name
        let user = interaction.options.getMentionable('user');
        let name = interaction.options.getString('character');

        // check if the user is a lekar
        if (!lekars.includes(user.id)) {
            return interaction.reply({content: "You are not a Lekar!", ephemeral: true});
        }



        // check if the user has any characters
        if (!users[user.id]) {
            const embed = new EmbedBuilder()
                .setTitle('User Not Found')
                .setColor(0xFF0000)
                .setDescription(`The user ${user} does not have any characters.`)
                .setTimestamp()

            return interaction.reply({embeds: [embed]});
        }

        // check if the character exists
        if (!users[user.id].characters[name]) {
            const embed = new EmbedBuilder()
                .setTitle('Character Not Found')
                .setColor(0xFF0000)
                .setDescription(`The character ${name} does not exist.`)
                .setTimestamp()

            return interaction.reply({embeds: [embed]});
        }

        // check if the character is dead
        if (users[user.id].characters[name].hp > 1000) {
            return interaction.reply({content: `${name} has too much HP to be healed, they must eat instead!`, ephemeral: true});
        }

        // if random number is above 75, the character heals
        if (Math.floor(Math.random() * 100) > 75) {
            // heal
            users[user.id].characters[name].hp += 10;
            users[user.id].characters[name].lastAte = Math.floor(Date.now());

            // save
            fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4));
            return interaction.reply(`You healed ${name} and restored 10 HP!`);
        }

        // if random number is below 75, the character does not heal
        return interaction.reply(`You tried to heal ${name}, but failed!`);
    }

}