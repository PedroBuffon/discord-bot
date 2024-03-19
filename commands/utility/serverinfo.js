const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { bearer } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraftinfo')
        .setDescription('Get information about the Minecraft server'),

    async execute(interaction) {
        try {
            const headers = {
                'Authorization': `Bearer ${bearer}`
            };

            const response = await axios.get('https://minecraft.buffon.cloud/api/v2/servers', { headers });
            const serverInfo = response.data;

            const embed = {
                color: 0x0099ff,
                title: 'Minecraft Server Information',
                fields: [
                    { name: 'Server ID', value: serverInfo.data[0].server_id },
                    { name: 'Server Name', value: serverInfo.data[0].server_name },
                    { name: 'Server IP', value: serverInfo.data[0].server_ip },
                    { name: 'Server Port', value: serverInfo.data[0].server_port },
                    { name: 'Type', value: serverInfo.data[0].type },
                    // Add more fields as needed
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Requested by ' + interaction.user.tag,
                },
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching Minecraft server info:', error);
            await interaction.reply('An error occurred while fetching Minecraft server info.');
        }
    },
};
