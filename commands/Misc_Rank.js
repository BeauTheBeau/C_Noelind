const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder, AttachmentBuilder, MessageAttachment} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const Canvas = require('@napi-rs/canvas');
const {request} = require('undici');

const applyText = (canvas, text) => {
    const context = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        context.font = `${fontSize -= 10}px bold sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return context.font;
};


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
            .setDescription(`XP: **${xp}**\nMessages: **${messages}**\nActive Character: **${users[user.id].active_character}**`)
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
        interaction.reply({embeds: [embed]});
    }
}