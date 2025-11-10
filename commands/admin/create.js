const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { adminRoleId } = require('../../config.json');
const stockManager = require('../../utils/stockManager');
const embeds = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Crée ou met à jour un service avec son émoji.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('service_name')
                .setDescription('Le nom du nouveau service')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('L\'émoji du service (ex: <:steam:123> ou 👍)')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({ embeds: [embeds.errorEmbed('Vous n\'avez pas la permission.')], ephemeral: true });
        }

        const serviceName = interaction.options.getString('service_name');
        const emoji = interaction.options.getString('emoji');

        if (/\s/.test(serviceName) || serviceName.includes('.')) {
             return interaction.reply({ embeds: [embeds.errorEmbed('Le nom ne peut pas contenir d\'espaces ou de points.')], ephemeral: true });
        }

        const success = stockManager.createService(serviceName, emoji);

        if (success) {
            await interaction.reply({ embeds: [embeds.successEmbed(`Service **${serviceName}** créé/mis à jour avec ${emoji}.`)], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embeds.errorEmbed('Erreur lors de la création du service.')], ephemeral: true });
        }
    },
};