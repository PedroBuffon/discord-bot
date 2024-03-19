const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { bearer } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraftstats')
        .setDescription('Get statistics about a specific Minecraft server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('Enter the server ID')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const serverId = interaction.options.getString('serverid');
            const headers = {
                'Authorization': `Bearer ${bearer}`
            };

            const response = await axios.get(`https://minecraft.buffon.cloud/api/v2/servers/${serverId}/stats`, { headers });
            const serverStats = response.data;


            const startedDate = new Date(serverStats.data.started);
            const currentTime = new Date();
            const uptimeMilliseconds = currentTime - startedDate;
            const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);

            // Convert uptimeSeconds to a human-readable format (hours, minutes, seconds)
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = uptimeSeconds % 60;

            const uptimeString = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
            // Extract CPU usage, memory usage, and world size from serverStats
            const cpuUsage = serverStats.data.cpu;
            const memoryUsage = serverStats.data.mem;
            const worldSize = serverStats.data.world_size;

            // Construct the embed object
            const embed = {
                color: 0x0099ff,
                title: 'Minecraft Server Statistics',
                fields: [
                    { name: 'Server ID', value: serverStats.data.server_id.server_id },
                    { name: 'Players Online', value: serverStats.data.online },
                    { name: 'Max Players', value: serverStats.data.max },
                    { name: 'Uptime', value: uptimeString },
                    { name: 'CPU Usage', value: cpuUsage },
                    { name: 'Memory Usage', value: memoryUsage },
                    { name: 'World Size', value: worldSize },
                    // Add more fields as needed
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Requested by ' + interaction.user.tag,
                },
            };

            // Send the embed as a response
            await interaction.reply({ embeds: [embed] });
                
        } catch (error) {
            console.error('Error fetching Minecraft server stats:', error);
            await interaction.reply('An error occurred while fetching Minecraft server stats.');
        }
    },
};
