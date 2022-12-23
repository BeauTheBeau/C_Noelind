const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const {ButtonStyle} = require("discord-api-types/v8");

const reportChannel = '1053320344775176272';



module.exports = {
    data: new SlashCommandBuilder()
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

    async execute(interaction) {
        let bugs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bugs.json'), 'utf8'));
        let bugsJSON = JSON.stringify(bugs, null, 4);



        // iterate over bugsJSON and see how many bugs there are
        let totalBugs = 0;
        for (let bug in bugs) {
            totalBugs++;
        }
        let bugNumber = totalBugs.toString().padStart(4, '0');

        let bug = interaction.options.getString('bug');
        let attachment = interaction.options.getAttachment('attachment');
        let isPrivate = interaction.options.getBoolean('private');


        let row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setCustomId(`done-${bugNumber}`)
                .setLabel('Mark DONE')
                .setStyle(ButtonStyle.Primary), new ButtonBuilder()
                .setCustomId(`progress-${bugNumber}`)
                .setLabel('Mark IN PROGRESS')
                .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
                .setCustomId(`delete-${bugNumber}`)
                .setLabel('Mark NOT A BUG')
                .setStyle(ButtonStyle.Danger),);

        let embed;


        if (isPrivate) {
            embed = new EmbedBuilder()
                .setTitle(`Bug #${bugNumber} Reported`)
                .setColor(0x00FF00)
                .setDescription(`Your bug has been reported. It was filed anonymously and you won't be contacted for 
                further information. i love gdpr and follow it to the letter.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});

            embed = new EmbedBuilder()
                .setTitle(`CASE #${bugNumber}`)
                .setColor(0x00FF00)
                .setDescription(`Bug reported anonymously:\`\`\`\n${bug}\`\`\``)
                .setTimestamp()

            if (attachment) {
                embed.setImage(attachment.url);
            } else {
                embed.setDescription(`Bug reported anonymously:\`\`\`\n${bug}\`\`\`\nNo image provided.`);
            }

            interaction.client.channels.cache.get(reportChannel).send({embeds: [embed], components: [row]});

        } else {
            embed = new EmbedBuilder()
                .setTitle(`Bug #${bugNumber} Reported`)
                .setColor(0x00FF00)
                .setDescription(`Your bug has been reported. You might be contacted for more information.`)
                .setTimestamp()

            interaction.user.send({embeds: [embed]});

            embed = new EmbedBuilder()
                .setTitle(`CASE #${bugNumber}`)
                .setColor(0x00FF00)
                .setDescription(`Bug reported by ${interaction.user}:\`\`\`\n${bug}\`\`\``)
                .setTimestamp()

            if (attachment) {
                embed.setImage(attachment.url);
            } else {
                embed.setDescription(`Bug reported by ${interaction.user}:\`\`\`\n${bug}\`\`\`\nNo image provided.`);
            }

            interaction.client.channels.cache.get(reportChannel).send({embeds: [embed], components: [row]});

            embed = new EmbedBuilder()
                .setTitle(`Bug #${bugNumber} Reported`)
                .setColor(0x00FF00)
                .setDescription(`Your bug has been reported, here's your copy of the report. You might be contacted for more information.`)
                .setTimestamp()

            interaction.user.send({embeds: [embed]});

            embed = new EmbedBuilder()
                .setTitle(`CASE #${bugNumber}`)
                .setColor(0x00FF00)
                .setDescription(`Bug reported by ${interaction.user}:\`\`\`\n${bug}\`\`\``)
                .setTimestamp()

            if (attachment) {
                embed.setImage(attachment.url);
            } else {
                embed.setDescription(`Bug reported by ${interaction.user}:\`\`\`\n${bug}\`\`\`\nNo image provided.`);
            }

            interaction.user.send({embeds: [embed]});
        }

        // save to json with key as bug number
        bugs[`CASE ${bugNumber}`] = {
            bug: bug, attachment: attachment, isPrivate: isPrivate, reportedBy: interaction.user, status: 'OPEN'
        };

        bugsJSON = JSON.stringify(bugs, null, 4);
        fs.writeFileSync(path.join(__dirname, '../data/bugs.json'), bugsJSON);
    }

}
