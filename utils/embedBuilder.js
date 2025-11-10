const { EmbedBuilder } = require('discord.js');

const mainColor = 0x5865F2;

const buildStockEmbed = (stockData) => {
    const embed = new EmbedBuilder()
        .setColor(mainColor)
        .setTitle('📊 Stock Actuel des Services')
        .setTimestamp();

    if (stockData.length === 0) {
        embed.setDescription('Aucun service n\'est actuellement disponible.');
    } else {
        const fields = stockData.map(service => ({
            name: `${service.emoji || ''} ${service.name}`,
            value: `\`${service.count}\``,
            inline: true
        }));
        embed.addFields(fields);
    }
    return embed;
};

const buildPanelEmbed = (stockData, panelGifUrl) => {
    const embed = new EmbedBuilder()
        .setColor(mainColor)
        .setTitle('Choisissez un service')
        .setDescription('Cliquez sur un bouton pour recevoir le compte du service correspondant.')
        .setImage(panelGifUrl);
    
    // Ajout des services au panel
    if (stockData.length > 0) {
        const serviceList = stockData.map(service => 
            `${service.emoji} **${service.name}** \`(${service.count})\``
        ).join('\n');
        embed.addFields({ name: "Services Disponibles", value: serviceList });
    }

    return embed;
};

const errorEmbed = (message) => {
    return new EmbedBuilder().setColor(0xFF0000).setDescription(`<:cooldown:1437422481337090108> ${message}`);
};

const successEmbed = (message) => {
    return new EmbedBuilder().setColor(0x00FF00).setDescription(`${message}`);
};

module.exports = {
    buildStockEmbed,
    buildPanelEmbed,
    errorEmbed,
    successEmbed
};