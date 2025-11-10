const { Events, Collection } = require('discord.js');
const { genChannelId, genCooldown, logChannelId, panelGifUrl } = require('../config.json');
const stockManager = require('../utils/stockManager');
const embeds = require('../utils/embedBuilder');
const { buildPanelButtons } = require('../utils/buttonBuilder');
const { updateLogMessage } = require('../utils/logManager');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`Commande ${interaction.commandName} non trouvée.`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Une erreur est survenue !', ephemeral: true });
            }
            return;
        }

        if (interaction.isButton()) {
            const customId = interaction.customId;

            if (customId.startsWith('GENERATE_')) {
                const serviceName = customId.split('_')[1];
                
                const readableUser = interaction.user.tag;

                if (interaction.channelId !== genChannelId) {
                    return interaction.reply({
                        embeds: [embeds.errorEmbed(`Vous ne pouvez générer que dans <#${genChannelId}>.`)],
                        ephemeral: true
                    });
                }

                const { cooldowns } = client;
                if (!cooldowns.has(interaction.user.id)) {
                    cooldowns.set(interaction.user.id, new Collection());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(interaction.user.id);
                const cooldownAmount = genCooldown;

                if (timestamps.has('gen')) {
                    const expirationTime = timestamps.get('gen') + cooldownAmount;
                    if (now < expirationTime) {
                        const timeLeftSeconds = (expirationTime - now) / 1000;
                        
                        const minutes = Math.floor(timeLeftSeconds / 60);
                        const seconds = Math.ceil(timeLeftSeconds % 60);
                        
                        let timeString = '';
                        if (minutes > 0) {
                            timeString += `${minutes} Minute${minutes > 1 ? 's' : ''} `;
                        }
                        if (seconds > 0) {
                            timeString += `${seconds} Seconde${seconds > 1 ? 's' : ''}`;
                        }
                        
                        return interaction.reply({
                            embeds: [embeds.errorEmbed(`Attendez **${timeString.trim()}** avant de générer.`)],
                            ephemeral: true
                        });
                    }
                }

                const account = stockManager.generateAccount(serviceName);

                if (!account) {
                    try {
                        const panelMessage = interaction.message;
                        const newStockData = stockManager.getAllStock();
                        const newEmbed = embeds.buildPanelEmbed(newStockData, panelGifUrl);
                        const newComponents = buildPanelButtons(newStockData);
                        await panelMessage.edit({ embeds: [newEmbed], components: newComponents });
                    } catch (e) { console.error("Erreur MAJ auto (stock vide):", e); }

                    const refuseLog = `[+] Refuse ${readableUser}: ${serviceName} Raison : No Stock`;
                    await updateLogMessage(client, logChannelId, refuseLog);

                    return interaction.reply({
                        embeds: [embeds.errorEmbed(`Stock épuisé pour **${serviceName}**.`)],
                        ephemeral: true
                    });
                }

                try {
                    const dmEmbed = embeds.successEmbed(`Voici votre compte : \n\n **Identifiants** \`\`\`${account}\`\`\``)
                        .setTitle(`Compte ${serviceName}!`)
                        .setImage(panelGifUrl); // <-- Utilisation de la variable de config
                        
                    await interaction.user.send({ embeds: [dmEmbed] });

                    timestamps.set('gen', now);
                    setTimeout(() => timestamps.delete('gen'), cooldownAmount);

                    await interaction.reply({
                        embeds: [embeds.successEmbed(`Compte **${serviceName}** envoyé en DM !`)],
                        ephemeral: true
                    });
                    
                    const successLog = `[+] Succes ${readableUser}: ${serviceName}`;
                    await updateLogMessage(client, logChannelId, successLog);

                    try {
                        const panelMessage = interaction.message;
                        const newStockData = stockManager.getAllStock();
                        const newEmbed = embeds.buildPanelEmbed(newStockData, panelGifUrl);
                        const newComponents = buildPanelButtons(newStockData);
                        
                        await panelMessage.edit({ embeds: [newEmbed], components: newComponents });
                    } catch (editError) {
                        console.error("Erreur MAJ auto panel:", editError);
                    }

                } catch (dmError) {
                    await interaction.reply({
                        embeds: [embeds.errorEmbed('Impossible de vous DM. Ouvrez vos messages privés.')],
                        ephemeral: true
                    });
                }
                return;
            }
        }
    },
};