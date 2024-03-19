const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: {
        name: 'confirm',
        description: 'Sends a confirmation message with buttons.',
    },
    async execute(interaction) {
        // Create buttons for confirm and cancel actions
        const confirmButton = new MessageButton()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle('SUCCESS');

        const cancelButton = new MessageButton()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle('DANGER');

        // Create an action row to hold the buttons
        const actionRow = new MessageActionRow()
            .addComponents(confirmButton, cancelButton);

        // Send the confirmation message with buttons
        await interaction.reply({ content: 'Are you sure you want to proceed?', components: [actionRow] });

        // Handle button interactions
        const filter = interaction => interaction.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'confirm') {
                await interaction.update({ content: 'You confirmed!', components: [] });
                collector.stop();
            } else if (interaction.customId === 'cancel') {
                await interaction.update({ content: 'You cancelled!', components: [] });
                collector.stop();
            }
        });

        collector.on('end', () => {
            if (!interaction.deleted) {
                interaction.deleteReply();
            }
        });
    },
};
