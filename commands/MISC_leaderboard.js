const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the top 10 users in the server'),

    async execute(interaction) {

            let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
            let leaderboard = Object.keys(users).map(function(key) {
                return [key, users[key]];
            });
            leaderboard.sort(function(first, second) {
                return second[1].xp - first[1].xp;
            });

            let top10 = leaderboard.slice(0, 10);
            let embed = new EmbedBuilder()
                .setTitle(`Leaderboard`)
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconUrl: interaction.user.avatarURL });

            for (let i = 0; i < top10.length; i++) {
                let user = top10[i][1];
                let rank = i + 1;
                embed.addFields({name: `#${rank}: ${user.username}`, value: `XP: ${user.xp}\nMessages: ${user.messages}`, inline: false});
            }
            interaction.reply({embeds: [embed]});
    }
}