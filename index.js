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
    }
    else {
        return
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
    }
    catch (error) {
        if (devMode) {
            interaction.reply({content: `There was an error: \`\`\`${error}\`\`\``, ephemeral: false});
            console.error(error);
        } else {
            interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
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

    // Check if the message is from a user
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;
    if (blacklist[message.channel.id]) return;

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

    } else {
        users[message.author.id].messages++;
        users[message.author.id].xp += Math.floor(Math.random() * 6) + 12;

        // Save the database
        fs.writeFile(path.join(__dirname, 'data/users.json'), JSON.stringify(users, null, 4), err => {
            if (err) throw err;
        });
    }

});
client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isButton()) return;

    let user = interaction.user;
    let users = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/users.json'), 'utf8'));
    let combat = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/combat.json'), 'utf8'));

    if (interaction.customId === 'bite' || interaction.customId === 'claw' || interaction.customId === 'tackle' || interaction.customId === 'surrender') {

        let combatID = users[user.id].combat;
        let combatants = [combat[combatID].attacker, combat[combatID].defender];
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
        if (isAttacker) { opponentHealth -= damage; }
        else { combatantHealth -= damage; }


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
});



client.login(token)
