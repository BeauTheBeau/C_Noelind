const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-item')
        .setDescription('Adds an item to the shop')
        .addStringOption(option => option
            .setName('item')
            .setDescription('The item to add')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('price')
            .setDescription('The price of the item')
            .setRequired(true)),

    async execute(interaction) {
        let item = interaction.options.getString('item');
        let price = interaction.options.getInteger('price');

        let shop = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shop.json'), 'utf8'));

        // check if the user has admin perms
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            if (shop[item]) {
                const embed = new EmbedBuilder()
                    .setTitle('Item already exists')
                    .setColor(0xFF0000)
                    .setDescription(`The item ${item} already exists in the shop.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }

            else {
                shop[item] = price;
                fs.writeFileSync(path.join(__dirname, '../data/shop.json'), JSON.stringify(shop, null, 4));
                const embed = new EmbedBuilder()
                    .setTitle('Item added')
                    .setColor(0x00FF00)
                    .setDescription(`The item ${item} was added to the shop.`)
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