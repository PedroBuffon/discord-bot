// const { SlashCommandBuilder } = require('discord.js');
// const axios = require('axios');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('restartserver')
//         .setDescription('Restart the Minecraft server'),

//     async execute(interaction) {
//         try {
//             const serverId = '1d4f9193-a0c3-45eb-a0b8-74429e65b296'; // Replace with your server ID
//             const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MTA4NDg0NzN9.-PVtyq_Y_1KTLbrH_uJAn-uOrtZY_U4u9jseWn88ewA'; // Replace with your actual bearer token

//             await interaction.deferReply({ ephemeral: true }); // Defer the reply to make a follow-up message ephemeral

//             // Send a confirmation message to the user as an embed
//             await interaction.followUp({
//                 content: 'Are you sure you want to restart the server?',
//                 embeds: [{
//                     title: 'Server Restart Confirmation',
//                     description: 'Click the button below to confirm the server restart.',
//                     color: 0xff0000 // Red color
//                 }],
//                 components: [
//                     {
//                         type: 'ACTION_ROW',
//                         components: [
//                             {
//                                 type: 'BUTTON',
//                                 label: 'Confirm',
//                                 style: 'SUCCESS',
//                                 customId: 'restart_confirmation'
//                             }
//                         ]
//                     }
//                 ]
//             });

//             // Await for the user's confirmation
//             const filter = i => i.user.id === interaction.user.id && i.customId === 'restart_confirmation';
//             const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

//             collector.on('collect', async i => {
//                 // User confirmed the restart
//                 if (i.isButton()) {
//                     // Send message to server saying it will restart in 5 minutes
//                     const restartMessage = 'say Server will restart in 5 minutes.';
//                     await axios.post(`https://minecraft.buffon.cloud/api/v2/servers/${serverId}/stdin`, restartMessage, {
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                             'Content-Type': 'text/plain'
//                         }
//                     });

//                     // Wait for 5 minutes (300,000 milliseconds) before restarting
//                     await new Promise(resolve => setTimeout(resolve, 300000));

//                     // Send request to restart server
//                     await axios.post(`https://minecraft.buffon.cloud/api/v2/servers/${serverId}/action/restart_server`, null, {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     });

//                     await i.reply({ content: 'Server restart initiated.', ephemeral: true }); // Reply to user with ephemeral message
//                 }
//             });

//             collector.on('end', async () => {
//                 // No confirmation received within the timeout period
//                 await interaction.followUp('No response received. Server restart cancelled.');
//             });

//         } catch (error) {
//             console.error('Error restarting Minecraft server:', error);
//             await interaction.reply('An error occurred while restarting the Minecraft server.');
//         }
//     },
// };
