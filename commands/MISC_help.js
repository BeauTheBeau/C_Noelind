const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of commands'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Noelind Bot help")
            .setColor(0x00FF00)
            .setDescription(
                '**Not the correct help?** Check <#894619282888089620>, <#894619136431378525>, or <#894619158891888692> instead.\n\n' +
                '**/help** - Shows this message\n``` ```' +

                '\n__**CHARACTER CREATION**\n__' +
                '**/characters** - Shows all of your characters\n' +
                '**/character** - Shows a specific character\'s stats\n' +
                '**/create-character** - Creates a new character\n' +
                '**/set-character** - Sets your active character, this will be used in fights and when other actions are taken\n' +
                '**/delete-character** - Deletes a character\n``` ```' +

                '\n__**SHOP**__\n' +
                '**/shop** - Shows the shop\n' +
                '**/buy** - Buys an item from the shop\n' +
                '**/sell** - Sells an item from your inventory\n' +
                '**/inventory** - Shows your inventory\n' +
                '`ADMIN ONLY` **/add-item** - Adds an item to the shop\n' +
                '`ADMIN ONLY` **/remove-item** - Removes an item from the shop\n``` ```' +

                '\n__**XP**__\n' +
                '**/rank** - Shows your XP\n' +
                '**/leaderboard** - Shows the XP leaderboard\n' +
                '`ADMIN ONLY` **/set-xp** - Sets a user\'s XP\n' +
                '`ADMIN ONLY` **/blacklisted** - Shows the blacklisted channels\n' +
                '`ADMIN ONLY` **/blacklist** - Blacklists a channel from XP gain\n' +
                '`ADMIN ONLY` **/unblacklist** - Unblacklists a channel from XP gain\n``` ```' +

                '\n__**COMBAT**__\n' +
                '**/fight** - Initiate a fight with a user\n' +
                '> Use the buttons on the message to choose your moves'
            )

            .setTimestamp()

        interaction.reply({embeds: [embed]});
    }

}