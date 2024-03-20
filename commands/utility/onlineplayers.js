const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { bearer } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players')
        .setDescription('Get Online Players')
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

            // Extract CPU usage, memory usage, and world size from serverStats
            const onlinePlayers = serverStats.data.online;
            const playerList = serverStats.data.players;

            if (playerList.length >= 1){
                // let formattedPlayerList = '';

                // // Construct the player list string
                // for (const player of playerList) {
                //     formattedPlayerList += `${player}\n`;
                // }
                // Construct the embed object
                const embed = {
                    color: 0x0099ff,
                    title: 'Online Players',
                    fields: [
                        { name: 'Total', value: onlinePlayers },
                        { name: 'List', value: `${playerList}\n` },

                        // Add more fields as needed
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: 'Requested by ' + interaction.user.tag,
                    },
                };
                // Send the embed as a response
                await interaction.reply({ embeds: [embed] });
            }else{
                // Construct the embed object
                const embed = {
                    color: 0x0099ff,
                    title: 'No Players Online',
                    timestamp: new Date(),
                    footer: {
                        text: 'Requested by ' + interaction.user.tag,
                    },
                };
                // Send the embed as a response
                await interaction.reply({ embeds: [embed] });
            }                
        } catch (error) {
            console.error('Error fetching Minecraft server stats:', error);
            await interaction.reply('An error occurred while fetching Minecraft server stats.');
        }
    },
};
