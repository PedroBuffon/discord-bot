const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { bearer } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendmessage')
        .setDescription('Send a message to the Minecraft server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the Minecraft server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),

    async execute(interaction) {
        try {
            let messageContent = interaction.options.getString('message');
            let serverId = interaction.options.getString('serverid');

            // Get the user's username and discriminator
            const username = interaction.user.username;
            const discriminator = interaction.user.discriminator;

            // Prefix the message with "say" followed by the username and discriminator
            messageContent = `say [${username}#${discriminator}]:${messageContent}`;

            const headers = {
                'Authorization': `Bearer ${bearer}`,
                'Content-Type': 'text/plain' // Set content type to text/plain for raw text body
            };

            const url = `https://minecraft.buffon.cloud/api/v2/servers/${serverId}/stdin`;

            await axios.post(url, messageContent, { headers }); // Send the messageContent directly as the request body

            await interaction.reply('Message sent to the Minecraft server.');

            // Delete the command message after execution
            await interaction.deleteReply(); // This deletes the original command message
        } catch (error) {
            console.error('Error sending message to Minecraft server:', error);
            await interaction.reply('An error occurred while sending the message to the Minecraft server.');
        }
    },
};
