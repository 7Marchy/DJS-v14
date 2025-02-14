const {
    Client,
    Events,
    Collection,
    GatewayIntentBits,
    Partials,
    MessageFlags,
} = require('discord.js'); // Importing discord.js

const path = require('path'); // Importing the path module
const fs = require('fs'); // Importing the fs module

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember
    ],
}) // Creating a new client. These are the intents and partials I use, you can add more if you want.

//Creating Command Handler with Collection
client.commands = new Collection(); // Creating a new collection for commands

const foldersPath = path.join(__dirname, 'commands'); // Path to the commands folder
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`); // If the command is missing the data or execute property, it will log a warning.
        }
    }
}
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName); 
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`); // If the command doesn't exist, it will log an error.
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral }); // If there is an error while executing the command, it will follow up with an error message.
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral }); // If there is an error while executing the command, it will reply with an error message.
		}
	}
});

// Creating a web server to keep the bot alive
const express = require('express');
const app = express();
const port = 3000; // The port the server will run on

module.exports = app;

app.use(express.static(path.join(__dirname, 'src')));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')));

app.listen(port, () => console.log("Server ready on port 3000."));

require('dotenv').config(); // Importing the dotenv package to use environment variables
client.login(process.env.TOKEN); // Logging in with the token from the .env file