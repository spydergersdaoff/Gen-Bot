const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Prêt ! Connecté en tant que ${client.user.tag}`);
        client.user.setActivity('By @SpyderGersda', {
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/spydergersda',
        });
    },
};
