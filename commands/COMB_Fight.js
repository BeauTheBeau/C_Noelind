const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, client, Events} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('surrender')
            .setLabel('Surrender')
            .setStyle(ButtonStyle.Danger),
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('bite')
            .setLabel('Bite')
            .setStyle(ButtonStyle.Primary),
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('claw')
            .setLabel('Claw')
            .setStyle(ButtonStyle.Primary),
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('tackle')
            .setLabel('Tackle')
            .setStyle(ButtonStyle.Primary),
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fight')
        .setDescription('Start a fight with another user')
        .addMentionableOption(option => option
            .setName('user')
            .setDescription('The user to fight')
            .setRequired(true)),
    async execute(interaction) {

        let user = interaction.user;
        let target = interaction.options.getMentionable('user');
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        let combat = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/combat.json'), 'utf8'));
        let combatKeys = Object.keys(combat);

        let combatID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        /*
        ================================================================================================================
        DATABASE CHECKS - DATABASE CHECKS - DATABASE CHECKS - DATABASE CHECKS - DATABASE CHECKS - DATABASE CHECKS - D...
        ================================================================================================================
        */

        if (!users[user.id]) {
            users[user.id] = {
                id: user.id,
                username: user.username,
                messages: 0,
                xp: 0,
                characters: {},
                inventory: {},
                combat: "",
                inCombat: false
            };

            // Save the database
            fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4), err => {
                if (err) throw err;
            });

            return interaction.reply({
                content: 'You have not yet registered a character with the bot, please do so with `/create-character`.',
                ephemeral: true
            });
        }
        if (!users[target.id]) {
            users[target.id] = {
                id: target.id,
                username: target.username,
                messages: 0,
                xp: 0,
                characters: {},
                inventory: {},
                combat: "",
                inCombat: false
            };

            // Save the database
            fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4), err => {
                if (err) throw err;
            });

            return interaction.reply({
                content: 'The target has not yet registed with the bot, tell them to do so with `/create-character`.',
                ephemeral: true
            });
        }

        /*
        ================================================================================================================
        COMBAT CHECKS - COMBAT CHECKS - COMBAT CHECKS - COMBAT CHECKS - COMBAT CHECKS - COMBAT CHECKS - COMBAT CHECKS...
        ================================================================================================================
        */

        if (users[user.id].inCombat) {
            return interaction.reply({
                content: 'You are already in combat! Do `/view-combat` to see more.',
                ephemeral: true
            });
        }
        if (users[target.id].inCombat) {
            return interaction.reply({
                content: 'The target is already in combat!',
                ephemeral: true
            });
        }

        /*
        ================================================================================================================
        CHARACTER CHECKS - CHARACTER CHECKS - CHARACTER CHECKS - CHARACTER CHECKS - CHARACTER CHECKS - CHARACTER CHEC...
        ================================================================================================================
        */

        if (Object.keys(users[user.id].characters).length === 0) {
            return interaction.reply({
                content: 'You have not yet created a character, please do so with `/create-character`.',
                ephemeral: true
            });
        }
        if (Object.keys(users[target.id].characters).length === 0) {
            return interaction.reply({
                content: 'The target has not yet created a character, tell them to do so with `/create-character`.',
                ephemeral: true
            });
        }

        /*
        ================================================================================================================
        ACTUAL FIGHT - ACTUAL FIGHT - ACTUAL FIGHT - ACTUAL FIGHT - ACTUAL FIGHT - ACTUAL FIGHT - ACTUAL FIGHT - ACTU...
        ================================================================================================================
         */

        let userCharacter = users[user.id].active_character;
        let targetCharacter = users[target.id].active_character;

        let userCharacterData = users[user.id].characters[userCharacter];
        let targetCharacterData = users[target.id].characters[targetCharacter];

        combat[combatID] = {
            id: combatID,
            attacker: user.id,
            defender: target.id,
            damage: [0, 0],
            turns: 0,
        }

        users[user.id].inCombat = true;
        users[user.id].combat = combatID;
        users[target.id].inCombat = true;
        users[target.id].combat = combatID;

        // Save the database
        fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4), err => {
            if (err) throw err;
        });

        // Save the database
        fs.writeFile(path.join(__dirname, '../data/combat.json'), JSON.stringify(combat, null, 4), err => {
            if (err) throw err;
        })

        interaction.reply({
            content: `<@${user.id}> is fighting <@${target.id}>! It's turn #${combat[combatID]+1} and <@${user.id}> is up first!`,
            components: [row]
        });
    }
}