const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'))

function checkUserExists(user) {
    if (!users[user.id]) {
        users[user.id] = {
            id: user.id,
            username: user.username,
            messages: 0,
            xp: 0,
            characters: {},
            inventory: {}
        };

        // Save the database
        fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4), err => {
            if (err) throw err;
        });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setxp')
        .setDescription('Sets the XP of a user')
        .addMentionableOption(option => option
            .setName('user')
            .setDescription('The user to set the XP of')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('xp')
            .setDescription('The amount of XP to set')
            .setRequired(true)),


    async execute(interaction) {

        users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let user = interaction.options.getMentionable('user');
        console.log(user)
        let xp = interaction.options.getInteger('xp');

        checkUserExists(user);

        // Wait 1 second
        setTimeout(() => {
            users[user.id].xp = xp;
            fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4), err => {
                if (err) throw err;
            });
        }, 1000);

        fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users), (err) => {
            if (err) console.log(err);
        });

        const embed = new EmbedBuilder()
            .setTitle(`Set XP`)
            .setColor(0x00FF00)
            .setDescription(`Set <@${user.id}>'s XP to ${xp}`)
            .setTimestamp()
            .setFooter({ text: `Executed by ${interaction.user.username}`, iconUrl: interaction.user.avatarURL });

        interaction.reply({embeds: [embed]});

    }

}