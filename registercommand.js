// Description: Registers all the commands for the bot
const {
    REST,
    Routes,
    SlashCommandBuilder,
} = require('discord.js')

require('dotenv').config(); // Importing the dotenv package to use environment variables
const clientId = (process.env.CLIENT_ID); // The client ID of the bot
const rest = new REST().setToken(process.env.TOKEN); // Setting the token for the REST API, required TOKEN in .env file

if (!clientId) {
    console.error('CLIENT_ID is not defined. Please check your .env file.');
    process.exit(1); // Exits the process if the CLIENT_ID is not defined
}
else if (!process.env.TOKEN) {
    console.error('TOKEN is not defined. Please check your .env file.');
    process.exit(1); // Exits the process if the TOKEN is not defined
}

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(clientId), {
                body: [
                    new SlashCommandBuilder()
                    .setName('beep')
                    .setDescription('Replies with Boop!'),
                ],
            },
        );
        console.log('✅ Successfully registered the command.');
    } catch (error) {
        console.error(error);
    }
})();