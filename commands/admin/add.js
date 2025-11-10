const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { adminRoleId } = require('../../config.json');
const stockManager = require('../../utils/stockManager');
const embeds = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Ajoute un compte à un service.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('service_name')
                .setDescription('Le nom du service (ex: netflix)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('account_data')
                .setDescription('Le compte à ajouter (ex: email:pass)')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({ embeds: [embeds.errorEmbed('Vous n\'avez pas la permission.')], ephemeral: true });
        }

        const serviceName = interaction.options.getString('service_name');
        const accountData = interaction.options.getString('account_data');

        try {
            const success = stockManager.addAccount(serviceName, accountData);
            if (!success) {
                 return interaction.reply({ embeds: [embeds.errorEmbed(`Le service **${serviceName}** n'existe pas. Créez-le d'abord avec \`/create\`.`)], ephemeral: true });
            }

            const newStock = stockManager.getStockCount(serviceName);
            await interaction.reply({
                embeds: [embeds.successEmbed(`Compte ajouté à **${serviceName}**. Nouveau stock : \`${newStock}\`.`)],
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({ embeds: [embeds.errorEmbed('Erreur lors de l\'ajout du compte.')], ephemeral: true });
        }
    },
};
