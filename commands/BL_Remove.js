const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Blacklists a channel from XP gain')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to blacklist')
            .setRequired(true)),

    async execute(interaction) {

        let channels = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blacklisted.json'), 'utf8'));
        let channel = interaction.options.getChannel('channel');
        let embed;

        // if channel exists
        if (channels[channel]) {
            if (channels[channel] === true) {
                const embed = new EmbedBuilder()
                    .setTitle('Channel unblacklisted')
                    .setColor(0xFF0000)
                    .setDescription(`The channel ${channel} was removed from the blacklist.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            } else {
                channels[channel] = true;
                fs.writeFileSync(path.join(__dirname, '../data/blacklisted.json'), JSON.stringify(channels, null, 4));
                const embed = new EmbedBuilder()
                    .setTitle('Channel Unblacklisted')
                    .setColor(0x00FF00)
                    .setDescription(`The channel ${channel} is not on the blacklist.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }
        } else {
            channels[channel] = false;
            fs.writeFileSync(path.join(__dirname, '../data/blacklisted.json'), JSON.stringify(channels, null, 4));
            const embed = new EmbedBuilder()
                .setTitle('Channel Unblacklisted')
                .setColor(0x00FF00)
                .setDescription(`The channel ${channel} is not on the blacklist.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        }


    }
}