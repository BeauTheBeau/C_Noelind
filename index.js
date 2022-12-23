const {Client, Collection, GatewayIntentBits, Events} = require('discord.js');
const {AttachmentBuilder, EmbedBuilder} = require('discord.js');
const {token} = require('./data/bot-data.json');
const fs = require('node:fs');
const path = require('node:path');
const client = new Client({
    intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

let users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf8'));
let blacklist = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/blacklisted.json'), 'utf8'));

const devMode = true

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

function checkUserExists(user) {
    if (!users[user.id]) {
        users[user.id] = {
            id: user.id,
            username: user.username,
            messages: 0,
            xp: 0,
            characters: {},
            inventory: {}
        };

        // Save the database
        fs.writeFile(path.join(__dirname, 'data/users.json'), JSON.stringify(users, null, 4), err => {
            if (err) throw err;
        });
    } else {

    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        if (devMode) {
            interaction.reply({
                content: `There was an error. Consider doing /bug-report and copy-pasting the report into the bug field.  \`\`\`${error}\`\`\``,
                ephemeral: false
            });
            console.error(error);
        } else {
            interaction.reply({content: 'There was an error while executing this command', ephemeral: true});
            console.error(error);
        }
    }


    let time = new Date();
    // into HH:MM:SS | DD/MM/YYYY format
    let timeString = time.toLocaleTimeString('en-GB', {hour12: false}) + ' @ ' + time.toLocaleDateString('en-GB');
    console.log(`${timeString} | Command ${interaction.commandName} used by ${interaction.user.username} (${interaction.user.id})`);

});
client.on('messageCreate', async message => {
    blacklist = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/blacklisted.json'), 'utf8'));

    // Loop through each user in the database
    for (let user in users) {

        // Loop through their characters
        for (let character in users[user].characters) {

            // ---------------------------------------------------------------------------------------------------------
            // LAST EATEN LOGIC
            // ---------------------------------------------------------------------------------------------------------

            if (users[user].characters[character].health <= 0) {

                // check if users[user].characters[character].lastAte is undefined
                if (users[user].characters[character].lastAte === undefined) {
                    users[user].characters[character].lastAte = new Date().getTime();
                }

                // Check the character's lastAte property, if it is more than 3 days ago, remove 25 health
                if (users[user].characters[character].lastAte < Date.now() - 86400000 * 3) {

                    // Check if they took damage in the last day
                    if (users[user].characters[character].lastDamage < Date.now() - 86400000) {
                        users[user].characters[character].health -= 25;
                        users[user].characters[character].lastDamage = new Date().getTime();
                    }

                    users[user].characters[character].health -= 25;
                    users[user].characters[character].lastDamage = Date.now();

                    // message the user
                    client.users.fetch(user).then(user => {
                        user.send(`Your character ${character} has lost 25 health due to not eating for 3 days! 
                    \nYou can eat by doing /eat ${character}`);
                    });

                }
            }
        }


        // Save the database
        fs.writeFile(path.join(__dirname, 'data/users.json'), JSON.stringify(users, null, 4), err => {
            if (err) throw err;
        });

        // ---------------------------------------------------------------------------------------------------------
        // BLACKLIST LOGIC
        // ---------------------------------------------------------------------------------------------------------


        // Check if the message is from a user
        if (message.author.bot) return;
        if (message.channel.type === 'DM') return;
        if (blacklist[message.channel.id]) return;

        // -------------------------------------------------------------------------------------------------------------
        // LEVELLING LOGIC (XP)
        // -------------------------------------------------------------------------------------------------------------

        // Check if the user is in the database
        if (!users[message.author.id]) {
            users[message.author.id] = {
                id: message.author.id,
                username: message.author.username,
                messages: 1,
                xp: 0,
                characters: {},
                inventory: {}
            };

            // Save the database
            fs.writeFile(path.join(__dirname, 'data/users.json'), JSON.stringify(users, null, 4), err => {
                if (err) throw err;
            });

        }
        else {
            users[message.author.id].messages++;
            users[message.author.id].xp += Math.floor(Math.random() * 6) + 12;

            // Save the database
            fs.writeFile(path.join(__dirname, 'data/users.json'), JSON.stringify(users, null, 4), err => {
                if (err) throw err;
            });
        }
    }
});

    client.on(Events.InteractionCreate, interaction => {
        if (!interaction.isButton()) return;

        // -------------------------------------------------------------------------------------------------------------
        // COMBAT LOGIC
        // -------------------------------------------------------------------------------------------------------------

        let user = interaction.user;
        let users = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/users.json'), 'utf8'));
        let combat = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/combat.json'), 'utf8'));

        if (
            interaction.customId === 'bite' ||
            interaction.customId === 'claw' ||
            interaction.customId === 'tackle' ||
            interaction.customId === 'surrender'
        ) {


            let combatID = users[user.id].combat;

            console.log(combat[combatID])

            let combatants = [
                combat[combatID].attacker,
                combat[combatID].defender
            ];
            let isAttacker = combatants[0].id === user.id;

            let combatantCharacter = users[user.id].characters[users[user.id].active_character];
            let opponentCharacter = users[combatants[1].id].characters[users[combatants[1].id].active_character];

            let combatantHealth = combatantCharacter.hp;
            let opponentHealth = opponentCharacter.hp;

            let damageRanges = {
                bite: [3, 8],
                claw: [5, 11],
                tackle: [4, 13]
            }

            if (interaction.customId === 'surrender') {
                let combatID = users[user.id].combatID;
                users[user.id].combatID = null;
                users[user.id].combat = false;

                // reward the opponent
                users[combatants[1].id].cxp += 100;


                // Save the database
                fs.writeFile(path.join(__dirname, 'data/users.json'), JSON.stringify(users, null, 4), err => {
                    if (err) throw err;
                });

                return interaction.update({
                    content: `${user.username} has surrendered! ${combatants[isAttacker ? 1 : 0].username || combatants[isAttacker ? 1 : 0].name} wins!`,
                });
            } // Surrender
            if (combatants[isAttacker ? 1 : 0].hp <= 0) {
                return interaction.update({
                    content: `${combatants[isAttacker ? 1 : 0].username || combatants[isAttacker ? 1 : 0].name} has been defeated!`,
                });
            } // Defeat

            let damage = Math.floor(Math.random() * (damageRanges[interaction.customId][1] - damageRanges[interaction.customId][0] + 1)) + damageRanges[interaction.customId][0];

            // Take away damage from the defender and update the database
            // if it attacker
            if (isAttacker) {
                opponentHealth -= damage;
            } else {
                combatantHealth -= damage;
            }


            fs.writeFile(path.join(__dirname, 'data/combat.json'), JSON.stringify(combat, null, 4), err => {
                if (err) throw err;
            });

            combat[combatID].turns++;
            combat[combatID].attackerTurn = !combat[combatID].attackerTurn;

            // Save the database
            fs.writeFile(path.join(__dirname, 'data/combat.json'), JSON.stringify(combat, null, 4), err => {
                if (err) throw err;
            });

            return interaction.update({
                content: `${combatants[isAttacker ? 0 : 1].username || combatants[isAttacker ? 0 : 1].name} has ${combatants[isAttacker ? 0 : 1].hp} health left!`,
            });
        }

        // -------------------------------------------------------------------------------------------------------------
        // BUG REPORT LOGIC
        // -------------------------------------------------------------------------------------------------------------

        // if interactionid has done-
        if (interaction.customId.includes('done-')) {
            let bugs = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/bugs.json'), 'utf8'));
            let bugID = interaction.customId.split('-')[1];
            let bug = bugs["CASE " + bugID];

            // add a key to the bug object called status and set it to done
            bug.status = 'DONE';

            // save the database
            fs.writeFile(path.join(__dirname, 'data/bugs.json'), JSON.stringify(bugs, null, 4), err => {
                if (err) throw err;
            })

            // React to the interaction with a checkmark
            interaction.update({
                content: `Bug #${bugID} has been marked as done!`,
                components: []
            })

            // if bug.isPrivate is false, send a message to teh user who reported the bug
            if (!bug.isPrivate) {
                client.users.fetch(bug.reportedBy.id).then(user => {
                    user.send(`Your bug report #${bugID} has been marked as done!`);
                })
            }


        }
    });


    client.login(token)
