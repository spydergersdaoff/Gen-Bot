const { EmbedBuilder } = require('discord.js');

const MAX_LOGS = 15;
const LOG_TITLE = 'LOG';
const LOG_COLOR = null;

let currentLogs = [];
let logMessageId = null;

async function updateLogMessage(client, logChannelId, logLine) {
    const channel = await client.channels.fetch(logChannelId).catch(() => null);
    if (!channel || channel.type !== 0) return console.error(`❌ Salon de log introuvable ou invalide: ${logChannelId}`);

    currentLogs.unshift(logLine);

    if (currentLogs.length > MAX_LOGS) {
        currentLogs.pop();
    }

    const logDescription = '```' + currentLogs.join('\n') + '```';

    const logEmbed = new EmbedBuilder()
        .setTitle(LOG_TITLE)
        .setDescription(logDescription)
        .setColor(LOG_COLOR);

    try {
        if (!logMessageId) {
            const logMessage = await channel.send({ embeds: [logEmbed] });
            logMessageId = logMessage.id;
        } else {
            const messageToEdit = await channel.messages.fetch(logMessageId).catch(() => null);

            if (messageToEdit) {
                await messageToEdit.edit({ embeds: [logEmbed] });
            } else {
                logMessageId = null;
                await updateLogMessage(client, logChannelId, logLine);
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi/édition du log:", error);
    }
}

module.exports = {
    updateLogMessage,
};