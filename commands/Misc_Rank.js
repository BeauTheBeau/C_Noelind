const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Shows your rank in the server')
        .addMentionableOption(option => option
            .setName('user')
            .setDescription('The user to show the rank of')
            .setRequired(false)),

    async execute(interaction) {

        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let user; if (!user) { user = interaction.user; } else { user = interaction.options.getMentionable('user'); }

        let xp = users[user.id].xp;
        let messages = users[user.id].messages;

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Rank`)
            .setColor(0x00FF00)
            .setDescription(`**XP:** ${xp}\n**Messages:** ${messages}`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconUrl: interaction.user.avatarURL });

        interaction.reply({embeds: [embed]});

    }
}