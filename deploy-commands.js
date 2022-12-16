const {SlashCommandBuilder} = require('discord.js');
const {REST} = require('@discordjs/rest');
const {id, token} = require('./data/bot-data.json');
const {Routes} = require('discord-api-types/v9');

let rest = new REST({version: '9'}).setToken(token);
rest.get(Routes.applicationCommands(id))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(id)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });

const commands = [
    // TODO: Add help command DO
    new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Shows a list of commands.`),

    // TODO: Add bug report command
    new SlashCommandBuilder()
        .setName(`report-bug`)
        .setDescription(`Report a bug to the developer.`)
        .addStringOption(option => option
            .setName(`bug`)
            .setDescription(`The bug you want to report.`)
            .setRequired(true))
        .addAttachmentOption(option => option
            .setName(`attachment`)
            .setDescription(`An optional image to demonstrate the bug.`)
            .setRequired(false))
        .addBooleanOption(option => option
            .setName(`private`)
            .setDescription(`If you choose to keep the bug private, you won't be contacted for more information.`)
            .setRequired(false)),


    // XP COMMANDS -----------------------------------------------------------------
    // TODO: add a way to check the xp of other users

    new SlashCommandBuilder() // done
        .setName('rank')
        .setDescription('Shows your rank in the server')
        .addMentionableOption(option => option
            .setName('user')
            .setDescription('The user to show the rank of')
            .setRequired(false)),

    // TODO: add a way to show the rank of a user
    new SlashCommandBuilder() // done
        .setName('leaderboard')
        .setDescription('Shows the top 10 users in the server'), new SlashCommandBuilder() // done
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

    // BLACKLISTED CHANNEL COMMANDS ------------------------------------------------
    // TODO: add blacklist command

    new SlashCommandBuilder() // done
        .setName('blacklist')
        .setDescription('Blacklists a channel from XP gain')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to blacklist')
            .setRequired(true)), new SlashCommandBuilder() // done
        .setName('unblacklist')
        .setDescription('Unblacklists a channel from XP gain')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to unblacklist')
            .setRequired(true)), new SlashCommandBuilder() // done
        .setName('blacklisted')
        .setDescription('Shows the blacklisted channels'),

    // SHOP COMMANDS ---------------------------------------------------------------
    // TODO: add shop command

    new SlashCommandBuilder() // done
        .setName('shop')
        .setDescription('Shows the shop'), new SlashCommandBuilder() // done
        .setName('buy')
        .setDescription('Buys an item from the shop')
        .addStringOption(option => option
            .setName('item')
            .setDescription('The item to buy')
            .setRequired(true)), new SlashCommandBuilder()
        .setName('inventory') // done
        .setDescription('Shows your inventory'), new SlashCommandBuilder() // done
        .setName('add-item')
        .setDescription('Adds an item to the shop')
        .addStringOption(option => option
            .setName('item')
            .setDescription('The item to add')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('price')
            .setDescription('The price of the item')
            .setRequired(true)), new SlashCommandBuilder() // done
        .setName('remove-item')
        .setDescription('Removes an item from the shop')
        .addStringOption(option => option
            .setName('item')
            .setDescription('The item to remove')
            .setRequired(true)),

    // CHARACTER COMMANDS ----------------------------------------------------------
    // TODO: add character command

    new SlashCommandBuilder() // done
        .setName('create-character')
        .setDescription('Creates a character')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the character')
            .setRequired(true)), new SlashCommandBuilder() // done
        .setName('delete-character')
        .setDescription('Deletes a character')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the character')
            .setRequired(true)), new SlashCommandBuilder() // done
        .setName('character')
        .setDescription('Shows a character')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the character')
            .setRequired(true)), new SlashCommandBuilder() // done
        .setName('characters')
        .setDescription('Shows all characters'), new SlashCommandBuilder() // done
        .setName('set-character')
        .setDescription('Sets your active character')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The name of the character')
            .setRequired(true)),

    // COMBAT COMMANDS -------------------------------------------------------------
    // TODO: add combat command

    new SlashCommandBuilder()
        .setName('attack')
        .setDescription('Start a fight with another user')
        .addMentionableOption(option => option
            .setName('user')
            .setDescription('The user to fight')
            .setRequired(true))
        .addStringOption(option => option
            .setName('action')
            .setDescription('The action to perform')
            .setRequired(true)
            .addChoices({name: 'Bite', value: 'bite'}, {name: 'Claw', value: 'claw'}, {
                name: 'Tackle', value: 'tackle'
            }, {name: 'Surrender', value: 'surrender'})),
]


rest = new REST({version: '10'}).setToken(token);

rest.put(Routes.applicationCommands(id), {body: commands},).then(() => console.log('Registered all successfully.')).catch(console.error);


// Delete all commands
/*
const rest = new REST({version: '9'}).setToken(token);
rest.get(Routes.applicationCommands(id))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(id)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });

 */

