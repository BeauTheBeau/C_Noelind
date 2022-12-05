const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-item')
        .setDescription('Removes an item from the shop')
        .addStringOption(option => option
            .setName('item')
            .setDescription('The item to remove')
            .setRequired(true)),

    async execute(interaction) {
        let item = interaction.options.getString('item');

        let shop = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shop.json'), 'utf8'));

        // check if the user has admin perms
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            if (shop[item]) {
                delete shop[item];
                fs.writeFileSync(path.join(__dirname, '../data/shop.json'), JSON.stringify(shop, null, 4));
                const embed = new EmbedBuilder()
                    .setTitle('Item removed')
                    .setColor(0x00FF00)
                    .setDescription(`The item ${item} was removed from the shop.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }

            else {
                const embed = new EmbedBuilder()
                    .setTitle('Item does not exist')
                    .setColor(0xFF0000)
                    .setDescription(`The item ${item} does not exist in the shop.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Insufficient Permissions')
                .setColor(0xFF0000)
                .setDescription(`You do not have permission to use this command.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        }
    }
}