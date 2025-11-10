const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { adminRoleId, genChannelId, panelGifUrl } = require('../../config.json');
const stockManager = require('../../utils/stockManager');
const embeds = require('../../utils/embedBuilder');
const { buildPanelButtons } = require('../../utils/buttonBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Envoie le panel de génération dans le canal configuré.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({ embeds: [embeds.errorEmbed('Vous n\'avez pas la permission.')], ephemeral: true });
        }

        const genChannel = await interaction.client.channels.cache.get(genChannelId);
        if (!genChannel || genChannel.type !== ChannelType.GuildText) {
            return interaction.reply({ embeds: [embeds.errorEmbed('Le `genChannelId` est invalide.')], ephemeral: true });
        }

        const stockData = stockManager.getAllStock();
        if (stockData.length === 0) {
            return interaction.reply({ embeds: [embeds.errorEmbed('Aucun service créé. Utilisez `/create` d\'abord.')], ephemeral: true });
        }

        const panelEmbed = embeds.buildPanelEmbed(stockData, panelGifUrl);
        const components = buildPanelButtons(stockData);

        try {
            await genChannel.send({ embeds: [panelEmbed], components: components });
            await interaction.reply({ embeds: [embeds.successEmbed(`Panel envoyé dans <#${genChannelId}> !`)], ephemeral: true });
        
        } catch (error) {
            console.error("Erreur envoi panel:", error);
            await interaction.reply({ embeds: [embeds.errorEmbed('Impossible d\'envoyer le message. Vérifiez les permissions.')], ephemeral: true });
        }
    },
};