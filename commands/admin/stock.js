const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { adminRoleId } = require('../../config.json');
const stockManager = require('../../utils/stockManager');
const embeds = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Affiche le stock actuel de tous les services.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({ embeds: [embeds.errorEmbed('Vous n\'avez pas la permission.')], ephemeral: true });
        }

        const stockData = stockManager.getAllStock();
        const stockEmbed = embeds.buildStockEmbed(stockData);

        await interaction.reply({
            embeds: [stockEmbed],
            ephemeral: false
        });
    },
};