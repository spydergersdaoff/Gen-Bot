const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function buildPanelButtons(stockData) {
    const sortedData = [...stockData].sort((a, b) => {
        if (a.count > 0 && b.count === 0) return -1;
        if (a.count === 0 && b.count > 0) return 1;
        return a.name.localeCompare(b.name);
    });

    const serviceButtons = sortedData.map(service => {
        const button = new ButtonBuilder()
            .setCustomId(`GENERATE_${service.name}`)
            .setLabel(service.name);

        if (service.emoji) {
            try {
                button.setEmoji(service.emoji);
            } catch (error) {
                console.warn(`Emoji invalide pour ${service.name}: ${service.emoji}`);
            }
        }
        
        if (service.count > 0) {
            button.setStyle(ButtonStyle.Success);
        } else {
            button.setStyle(ButtonStyle.Secondary);
        }

        return button;
    });

    const allButtons = [...serviceButtons];
    const rows = [];
    for (let i = 0; i < allButtons.length; i += 5) {
        rows.push(
            new ActionRowBuilder().addComponents(allButtons.slice(i, i + 5))
        );
    }
    return rows;
}

module.exports = { buildPanelButtons };