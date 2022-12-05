const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buys an item from the shop')
        .addStringOption(option => option
            .setName('item')
            .setDescription('The item to buy')
            .setRequired(true)),

    async execute(interaction) {
        let item = interaction.options.getString('item');
        let shop = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shop.json'), 'utf8'));
        let user = JSON.parse(fs.readFileSync(path.join(__dirname, `../data/users.json`), 'utf8'));

        if (shop[item]) {
            if (user[interaction.user.id].xp >= shop[item]) {
                user[interaction.user.id].xp -= shop[item];

                // Add it to the user's inventory object
                if ( user[interaction.user.id].inventory[item] ) { user[interaction.user.id].inventory[item] += 1; }
                else { user[interaction.user.id].inventory[item] = 1; }

                fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(user, null, 4));
                const embed = new EmbedBuilder()
                    .setTitle('Item bought')
                    .setColor(0x00FF00)
                    .setDescription(`You bought **${item}** for **${shop[item]}** XP.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Insufficient XP')
                    .setColor(0xFF0000)
                    .setDescription(`You do not have enough XP to buy **${item}**.`)
                    .setTimestamp()

                interaction.reply({embeds: [embed]});
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Item not found')
                .setColor(0xFF0000)
                .setDescription(`The item **${item}** does not exist in the shop.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});
        }

    }
}