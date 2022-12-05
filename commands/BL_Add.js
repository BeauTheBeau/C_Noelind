const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
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
            if (channels[channel.id]) {
                if (channels[channel.id] === true) {
                    const embed = new EmbedBuilder()
                        .setTitle('Channel Already Blacklisted')
                        .setColor(0xFF0000)
                        .setDescription(`The channel ${channel} is already blacklisted.`)
                        .setTimestamp()

                    interaction.reply({embeds: [embed]});
                }
                else {
                    channels[channel.id] = true;
                    fs.writeFileSync(path.join(__dirname, '../data/blacklisted.json'), JSON.stringify(channels, null, 4));
                    const embed = new EmbedBuilder()
                        .setTitle('Channel Blacklisted')
                        .setColor(0x00FF00)
                        .setDescription(`The channel ${channel} has been blacklisted.`)
                        .setTimestamp()

                    interaction.reply({embeds: [embed]});
                }

            }

            else {
                channels[channel.id] = true;
                fs.writeFileSync(path.join(__dirname, '../data/blacklisted.json'), JSON.stringify(channels, null, 4));
                const embed = new EmbedBuilder()
                    .setTitle('Channel Blacklisted')
                    .setColor(0x00FF00)
                    .setDescription(`The channel ${channel} has been blacklisted.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }

    }
}