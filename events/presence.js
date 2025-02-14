const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`${client.user.tag} Is ready 🟢`);
        const Quote = "Made by 7marchy Teams! with DJS v14"; // The activity name you want to display
            client.user.setPresence({
                activities: [{ name: Quote, type: ActivityType.Playing }],
                status: 'online',
            });
            console.log(`Presence set to: ${Quote}`);
    },
};