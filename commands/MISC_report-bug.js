const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const reportChannel = '1053282850507595776';

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


        let totalBugs = bugsJSON.length;
        console.log(totalBugs);
        let bugNumber = totalBugs.toString().padStart(4, '0');

        let bug = interaction.options.getString('bug');
        let attachment = interaction.options.getAttachment('attachment');
        let isPrivate = interaction.options.getBoolean('private');

        let embed;

        if (isPrivate) {
            embed = new EmbedBuilder()
                .setTitle(`Bug #${bugNumber} Reported`)
                .setColor(0x00FF00)
                .setDescription(`Your bug has been reported. You will not be contacted for more information.`)
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

            interaction.client.channels.cache.get(reportChannel).send({embeds: [embed]});

        } else {
            embed = new EmbedBuilder()
                .setTitle(`Bug #${bugNumber} Reported`)
                .setColor(0x00FF00)
                .setDescription(`Your bug has been reported. You will be contacted for more information.`)
                .setTimestamp()

            interaction.reply({embeds: [embed]});

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

            interaction.client.channels.cache.get(reportChannel).send({embeds: [embed]});

            embed = new EmbedBuilder()
                .setTitle(`Bug #${bugNumber} Reported`)
                .setColor(0x00FF00)
                .setDescription(`Your bug has been reported. You may be contacted for more information.`)
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
            bug: bug,
            attachment: attachment,
            isPrivate: isPrivate,
            reportedBy: interaction.user
        };

        bugsJSON = JSON.stringify(bugs, null, 4);
        fs.writeFileSync(path.join(__dirname, '../data/bugs.json'), bugsJSON);
    }

}
